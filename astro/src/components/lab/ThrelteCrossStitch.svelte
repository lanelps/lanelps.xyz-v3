<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    WebGPURenderer,
    WebGLRenderTarget,
    Scene,
    OrthographicCamera,
    Mesh,
    PlaneGeometry,
    MeshBasicNodeMaterial,
    VideoTexture,
    TextureLoader,
    Texture,
    SRGBColorSpace,
  } from "three/webgpu";

  import {
    Fn,
    uv,
    uniform,
    vec2,
    vec3,
    vec4,
    float,
    floor,
    fract,
    abs,
    min,
    clamp,
    step,
    mix,
    dot,
    texture as texNode,
  } from "three/tsl";
  import Hls from "hls.js";

  interface Props {
    src: string;
    srcType: "image" | "video";
    bgSrc?: string;
    stitchColor?: string;
    threshold?: number;
    bloom?: number;
    cellSize?: number;
    lineWidth?: number;
  }

  const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
    ];
  };

  const {
    src,
    srcType,
    bgSrc,
    stitchColor = "#FFFFFF",
    threshold = 0.5,
    bloom = 1.5,
    cellSize = 12,
    lineWidth = 0.15,
  }: Props = $props();

  let canvasRef: HTMLCanvasElement;
  let rafId: number | null = null;
  let renderer: WebGPURenderer | null = null;
  let hlsInstance: Hls | null = null;
  let videoEl: HTMLVideoElement | null = null;
  let loadedTexture: Texture | VideoTexture | null = null;
  let loadedBgTexture: Texture | null = null;
  let stitchRT: WebGLRenderTarget | null = null;
  let blurHRT: WebGLRenderTarget | null = null;
  let blurVRT: WebGLRenderTarget | null = null;
  let imgWidth = 1;
  let imgHeight = 1;

  const uResolution = uniform(vec2(0, 0));
  const uCellSize = uniform(12);
  const uLineWidth = uniform(0.15);
  const uPadding = uniform(0.1);
  const uBgColor = uniform(vec3(1.0, 1.0, 1.0));
  const uStitchColor = uniform(vec3(0.0, 0.0, 0.0));
  const uThreshold = uniform(0.5);
  const uBloomStrength = uniform(0.0);

  // Contain transform — computed CPU-side and passed as uniforms
  const uContainScaleX = uniform(1.0);
  const uContainScaleY = uniform(1.0);
  const uContainOffsetX = uniform(0.0);
  const uContainOffsetY = uniform(0.0);

  $effect(() => {
    uCellSize.value = cellSize;
    uLineWidth.value = lineWidth;
    uThreshold.value = threshold;
    uBloomStrength.value = bloom;
    const [r, g, b] = hexToRgb(stitchColor);
    uStitchColor.value.set(r, g, b);
  });

  const updateContain = (imgW: number, imgH: number) => {
    if (!canvasRef) return;
    imgWidth = imgW;
    imgHeight = imgH;
    const canvasAspect = canvasRef.clientWidth / canvasRef.clientHeight;
    const imageAspect = imgW / imgH;
    const displayAspect = imageAspect / canvasAspect;
    const scaleX = Math.min(1.0, displayAspect);
    const scaleY = Math.min(1.0, 1.0 / displayAspect);
    uContainScaleX.value = scaleX;
    uContainScaleY.value = scaleY;
    uContainOffsetX.value = (1.0 - scaleX) / 2;
    uContainOffsetY.value = (1.0 - scaleY) / 2;
  };

  const placeholder = new Texture();
  // cellCenterUV maps canvas UV → image UV using the contain transform
  const cellCenterUV = Fn(() => {
    const pp = uv().mul(uResolution);
    const ci = floor(pp.div(uCellSize));
    const gs = floor(uResolution.div(uCellSize));
    const cellCenterCanvasUV = ci.add(0.5).div(gs);
    return cellCenterCanvasUV
      .sub(vec2(uContainOffsetX, uContainOffsetY))
      .div(vec2(uContainScaleX, uContainScaleY));
  })();
  const srcTexNode = texNode(placeholder, cellCenterUV);

  const bgPlaceholder = new Texture();
  const bgTexNode = texNode(bgPlaceholder, uv());
  const uHasBgImage = uniform(0.0);

  const handleResize = () => {
    if (!renderer || !canvasRef) return;
    const w = canvasRef.clientWidth;
    const h = canvasRef.clientHeight;
    renderer.setSize(w, h);
    stitchRT?.setSize(w, h);
    blurHRT?.setSize(w, h);
    blurVRT?.setSize(w, h);
    uResolution.value.set(w, h);
    if (imgWidth && imgHeight) updateContain(imgWidth, imgHeight);
  };

  onMount(async () => {
    const w = canvasRef.clientWidth;
    const h = canvasRef.clientHeight;

    const stitchScene = new Scene(); // Pass 1: stitch shapes → stitchRT
    const blurHScene = new Scene(); // Pass 2: horizontal Gaussian → blurHRT
    const blurVScene = new Scene(); // Pass 3: vertical Gaussian → blurVRT
    const scene = new Scene(); // Pass 4: bg + bloom + sharp → screen
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    renderer = new WebGPURenderer({
      canvas: canvasRef,
      antialias: true,
      forceWebGL: false,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    uResolution.value.set(w, h);

    await renderer.init();

    stitchRT = new WebGLRenderTarget(w, h);
    blurHRT = new WebGLRenderTarget(w, h);
    blurVRT = new WebGLRenderTarget(w, h);

    const geo = new PlaneGeometry(2, 2);

    // ── Pass 1: stitch shapes only, transparent background ──────────────────
    const stitchOnlyNode = Fn(() => {
      const pixelPos = uv().mul(uResolution);
      const cellUV = fract(pixelPos.div(uCellSize));
      const paddedUV = cellUV.sub(uPadding).div(uPadding.oneMinus().mul(2.0));
      const d1 = abs(paddedUV.x.sub(paddedUV.y));
      const d2 = abs(paddedUV.x.add(paddedUV.y).sub(1.0));
      const onX = step(min(d1, d2), uLineWidth);
      const inside = step(0.0, paddedUV.x)
        .mul(step(paddedUV.x, 1.0))
        .mul(step(0.0, paddedUV.y))
        .mul(step(paddedUV.y, 1.0));
      const ci = floor(pixelPos.div(uCellSize));
      const gs = floor(uResolution.div(uCellSize));
      const ccUV = ci.add(0.5).div(gs);
      const inImage = step(uContainOffsetX, ccUV.x)
        .mul(step(ccUV.x, uContainOffsetX.add(uContainScaleX)))
        .mul(step(uContainOffsetY, ccUV.y))
        .mul(step(ccUV.y, uContainOffsetY.add(uContainScaleY)));
      const alpha = srcTexNode.a;
      const lum = dot(srcTexNode.rgb, vec3(0.299, 0.587, 0.114));
      const effectiveLum = mix(float(1.0), lum, alpha);
      const isDark = float(1.0).sub(step(uThreshold, effectiveLum));
      const stitchMask = onX.mul(inside).mul(inImage).mul(isDark);
      return vec4(uStitchColor, stitchMask);
    })();

    const stitchMat = new MeshBasicNodeMaterial();
    stitchMat.transparent = true;
    stitchMat.outputNode = stitchOnlyNode;
    stitchScene.add(new Mesh(geo, stitchMat));

    // 13-tap 1-D Gaussian weights (sigma≈3, offsets -6..+6, sum≈1)
    const GW = [
      0.019, 0.034, 0.056, 0.083, 0.11, 0.13, 0.137, 0.13, 0.11, 0.083, 0.056,
      0.034, 0.019,
    ] as const;

    // ── Pass 2: horizontal Gaussian blur ────────────────────────────────────
    // Blur radius in UV = bloom * cellSize / resolution. Divided by 6 so the
    // ±6 tap range spans exactly bloom*cellSize pixels total.
    const blurHNode = Fn(() => {
      const hStep = uBloomStrength.mul(uCellSize).div(uResolution.x).div(6.0);
      const curUV = uv();
      let acc: any = texNode(
        stitchRT!.texture,
        curUV.add(vec2(hStep.mul(-6), 0.0))
      ).mul(GW[0]);
      for (let i = 1; i < 13; i++) {
        acc = acc.add(
          texNode(
            stitchRT!.texture,
            curUV.add(vec2(hStep.mul(i - 6), 0.0))
          ).mul(GW[i])
        );
      }
      return acc;
    })();
    const blurHMat = new MeshBasicNodeMaterial();
    blurHMat.transparent = true;
    blurHMat.outputNode = blurHNode;
    blurHScene.add(new Mesh(geo, blurHMat));

    // ── Pass 3: vertical Gaussian blur ──────────────────────────────────────
    const blurVNode = Fn(() => {
      const vStep = uBloomStrength.mul(uCellSize).div(uResolution.y).div(6.0);
      const curUV = uv();
      let acc: any = texNode(
        blurHRT!.texture,
        curUV.add(vec2(0.0, vStep.mul(-6)))
      ).mul(GW[0]);
      for (let i = 1; i < 13; i++) {
        acc = acc.add(
          texNode(blurHRT!.texture, curUV.add(vec2(0.0, vStep.mul(i - 6)))).mul(
            GW[i]
          )
        );
      }
      return acc;
    })();
    const blurVMat = new MeshBasicNodeMaterial();
    blurVMat.transparent = true;
    blurVMat.outputNode = blurVNode;
    blurVScene.add(new Mesh(geo, blurVMat));

    // ── Pass 4: composite ───────────────────────────────────────────────────
    // RT textures have flipY=false (opposite of image textures) — correct here.
    const compositeNode = Fn(() => {
      const rtUV = vec2(uv().x, float(1.0).sub(uv().y));
      const bgSample = mix(vec4(uBgColor, 1.0), bgTexNode, uHasBgImage);
      const bloomTex = texNode(blurVRT!.texture, rtUV);
      const hasBloom = step(float(0.001), uBloomStrength);
      const bloomFactor = clamp(
        bloomTex.a.mul(hasBloom),
        float(0.0),
        float(1.0)
      );
      const withBloom = mix(bgSample, vec4(uStitchColor, 1.0), bloomFactor);
      const sharp = texNode(stitchRT!.texture, rtUV);
      return mix(withBloom, vec4(uStitchColor, 1.0), sharp.a);
    })();

    const compMat = new MeshBasicNodeMaterial();
    compMat.transparent = true;
    compMat.outputNode = compositeNode;
    scene.add(new Mesh(geo, compMat));

    try {
      if (srcType === "image") {
        const loader = new TextureLoader();
        loadedTexture = await loader.loadAsync(src);
        loadedTexture.colorSpace = SRGBColorSpace;
        const img = loadedTexture.image as HTMLImageElement;
        updateContain(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height
        );
      } else {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";

        const videoSrc = `https://stream.mux.com/${src}.m3u8`;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoSrc;
          await new Promise<void>((resolve, reject) => {
            video.addEventListener(
              "loadedmetadata",
              () => video.play().then(resolve).catch(reject),
              { once: true }
            );
            video.addEventListener(
              "error",
              () => reject(new Error("Video error")),
              { once: true }
            );
          });
        } else if (Hls.isSupported()) {
          hlsInstance = new Hls();
          hlsInstance.loadSource(videoSrc);
          hlsInstance.attachMedia(video);
          await new Promise<void>((resolve, reject) => {
            hlsInstance!.on(Hls.Events.MANIFEST_PARSED, () =>
              video.play().then(resolve).catch(reject)
            );
            hlsInstance!.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) reject(new Error("HLS error"));
            });
          });
        } else {
          throw new Error("HLS not supported");
        }

        videoEl = video;
        loadedTexture = new VideoTexture(video);
        loadedTexture.colorSpace = SRGBColorSpace;
        updateContain(video.videoWidth, video.videoHeight);
      }

      srcTexNode.value = loadedTexture;
      loadedTexture.needsUpdate = true;

      if (bgSrc) {
        const bgLoader = new TextureLoader();
        loadedBgTexture = await bgLoader.loadAsync(bgSrc);
        loadedBgTexture.colorSpace = SRGBColorSpace;
        bgTexNode.value = loadedBgTexture;
        uHasBgImage.value = 1.0;
      }
    } catch (err) {
      console.error("CrossStitch: failed to load source", err);
    }

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (loadedTexture instanceof VideoTexture)
        loadedTexture.needsUpdate = true;
      // Pass 1: stitch shapes → stitchRT
      renderer!.setRenderTarget(stitchRT);
      renderer!.render(stitchScene, camera);
      // Pass 2: horizontal blur → blurHRT
      renderer!.setRenderTarget(blurHRT);
      renderer!.render(blurHScene, camera);
      // Pass 3: vertical blur → blurVRT
      renderer!.setRenderTarget(blurVRT);
      renderer!.render(blurVScene, camera);
      // Pass 4: composite → screen
      renderer!.setRenderTarget(null);
      renderer!.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", handleResize);
  });

  onDestroy(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
    hlsInstance?.destroy();
    videoEl?.pause();
    loadedTexture?.dispose();
    loadedBgTexture?.dispose();
    stitchRT?.dispose();
    blurHRT?.dispose();
    blurVRT?.dispose();
    renderer?.dispose();
  });
</script>

<canvas bind:this={canvasRef} class="fixed inset-0 h-full w-full"></canvas>
