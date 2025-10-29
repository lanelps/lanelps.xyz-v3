import * as twgl from "twgl.js";
import Hls from "hls.js";

// --- Shaders ---
import vs from "@utils/webgl/shaders/vertex.glsl?raw";
import fs from "@utils/webgl/shaders/fragment.glsl?raw";

import type { Image, GalleryItem } from "../../types";

// --- Types & Interfaces ---
export interface TextureInfo {
  texture: WebGLTexture;
  width: number;
  height: number;
  type: "image" | "video";
  videoElement?: HTMLVideoElement;
}

export interface WebGLResources {
  gl: WebGL2RenderingContext;
  programInfo: twgl.ProgramInfo;
  bufferInfo: twgl.BufferInfo;
  textures: TextureInfo[];
}

// --- Internal Module State ---
let resources: WebGLResources | null = null;
let rafId: number | null = null;
let scrollY = 0.501; // Initial scroll position is 0.5 to center the first texture. Adding 0.001 to avoid strange thin line/ artifact from rendering.
let virtualScroll = 0;
let totalHeight = 0;
let isMobile = false;
let gallery: GalleryItem[] = [];

// --- Public Helpers ---
export const setGallery = (g: GalleryItem[]) => {
  gallery = g;
};

export const setResources = (res: WebGLResources) => {
  resources = res;
};

const getViewportHeight = (): number =>
  window.visualViewport?.height || window.innerHeight;

const getViewportWidth = (): number =>
  window.visualViewport?.width || window.innerWidth;

// --- WebGL Setup ---
export const initWebGL = async (
  canvas: HTMLCanvasElement,
  galleryItems: GalleryItem[]
): Promise<void> => {
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("WebGL2 not supported");
    return;
  }

  const H = getViewportHeight();
  const W = getViewportWidth();

  // Set initial virtual scroll to half a viewport so that the first texture is centered.
  virtualScroll = H;
  updateVirtualScroll(0);

  // Create program and buffers
  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  const bufferInfo = createBuffers(gl);

  // Load textures for each item
  const textures = await loadTextures(gl, galleryItems);

  // Create looped textures by duplicating last and first texture
  const firstTexture = textures[0];
  const lastTexture = textures[textures.length - 1];
  const loopedTextures = [lastTexture, ...textures, firstTexture];

  // Set initial totalHeight before setting resources.
  // (Note: +2 accounts for duplicated textures, then subtract one viewport)
  totalHeight = (galleryItems.length + 2) * H - H;
  isMobile = W < H;

  // Save resources into module-level state.
  setResources({
    gl,
    programInfo,
    bufferInfo,
    textures: loopedTextures,
  });
};

export const createBuffers = (gl: WebGL2RenderingContext): twgl.BufferInfo => {
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    texcoord: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
  });

  if (!bufferInfo.attribs) {
    throw new Error("Failed to create buffer attributes");
  }

  return bufferInfo;
};

export const loadImage = async (
  gl: WebGL2RenderingContext,
  image: string
): Promise<TextureInfo> => {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.src = image;

  await new Promise<void>((resolve) => (img.onload = () => resolve()));

  img.decoding = "async";

  const texture = twgl.createTexture(gl, {
    src: img,
    mag: gl.LINEAR,
    min: gl.LINEAR,
  });
  return {
    texture,
    width: img.width,
    height: img.height,
    type: "image",
  } as TextureInfo;
};

export const loadVideo = async (
  gl: WebGL2RenderingContext,
  url: string
): Promise<TextureInfo> => {
  // Create and initialize the video element
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  const videoSrc = `https://stream.mux.com/${url}.m3u8`;

  // Helper function to start playback
  const playVideo = async (vid: HTMLVideoElement) => {
    await vid.play();
  };

  // If the browser supports native HLS playback
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoSrc;
    await new Promise<void>((resolve, reject) => {
      video.addEventListener(
        "loadedmetadata",
        () => {
          playVideo(video).then(resolve).catch(reject);
        },
        { once: true }
      );
      video.addEventListener(
        "error",
        () => reject(new Error("Video loading error")),
        { once: true }
      );
    });
  }
  // Otherwise, if HLS.js is supported and the URL indicates an HLS stream
  else if (videoSrc.endsWith(".m3u8") && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    await new Promise<void>((resolve, reject) => {
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        playVideo(video).then(resolve).catch(reject);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          reject(new Error("HLS stream loading error"));
        }
      });
    });
  }
  // If neither native HLS nor HLS.js is supported, throw an error
  else {
    throw new Error("HLS is not supported in this browser");
  }

  // Create the texture with the video as the source
  const texture = twgl.createTexture(gl, {
    src: video,
    mag: gl.LINEAR,
    min: gl.LINEAR,
  });

  return {
    texture,
    width: video.videoWidth,
    height: video.videoHeight,
    type: "video",
    videoElement: video,
  } as TextureInfo;
};

export const loadTextures = async (
  gl: WebGL2RenderingContext,
  galleryItems: GalleryItem[]
): Promise<TextureInfo[]> => {
  const texturePromises = galleryItems.map(async (item) => {
    if (item.type === "image") {
      return loadImage(gl, item.image);
    } else {
      return loadVideo(gl, item.video);
    }
  });

  return Promise.all(texturePromises);
};

// --- Rendering & Animation ---
export const render = (res: WebGLResources) => {
  const { gl, programInfo, bufferInfo, textures } = res;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Choose a rotation based on mobile (90° for mobile)
  const rotation = isMobile ? Math.PI / 2 : 0;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

  textures.forEach((textureInfo, index) => {
    const yOffset = index - scrollY;

    // Optimize: Skip drawing textures if their offset is outside the visible quad.
    if (yOffset < -1 || yOffset > 1) return;

    // Update video textures if needed.
    if (textureInfo.type === "video" && textureInfo.videoElement) {
      if (
        textureInfo.videoElement.readyState >=
        textureInfo.videoElement.HAVE_CURRENT_DATA
      ) {
        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          textureInfo.videoElement
        );
      }
    }

    // Setup uniforms for this texture.
    twgl.setUniforms(programInfo, {
      u_projection: twgl.m4.identity(),
      u_texture: textureInfo.texture,
      u_canvasSize: [gl.canvas.width, gl.canvas.height],
      u_textureSize: [textureInfo.width, textureInfo.height],
      u_yOffset: yOffset,
      u_rotation: rotation,
    });
    twgl.drawBufferInfo(gl, bufferInfo);
  });
};

export const animateCavnas = (canvasRef: HTMLCanvasElement) => {
  if (resources) {
    twgl.resizeCanvasToDisplaySize(canvasRef);
    render(resources);
  }
  rafId = requestAnimationFrame(() => animateCavnas(canvasRef));
};

export const cleanup = () => {
  if (resources) {
    const { gl, programInfo, bufferInfo, textures } = resources;

    if (programInfo?.program) {
      gl.deleteProgram(programInfo.program);
    }

    if (bufferInfo?.attribs) {
      Object.values(bufferInfo.attribs).forEach((attrib) => {
        if (attrib.buffer) {
          gl.deleteBuffer(attrib.buffer);
        }
      });

      if (bufferInfo.indices) {
        gl.deleteBuffer(bufferInfo.indices);
      }
    }

    textures.forEach(({ texture }) => {
      gl.deleteTexture(texture);
    });

    // Unbind any active buffers and textures
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    resources = null;
  }

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

// --- Window Handlers ---
export const handleResize = () => {
  const H = getViewportHeight();
  const W = getViewportWidth();

  totalHeight = (gallery.length + 2) * H - H;
  isMobile = W < H;
};

export const updateVirtualScroll = (deltaY: number) => {
  if (!resources) return;

  const H = getViewportHeight();
  const N = gallery.length; // Number of actual gallery items

  // Update the virtual scroll value based on deltaY from wheel or touch events.
  virtualScroll += deltaY;

  // Define thresholds so that the effective scroll stays within one cycle
  const lowerThreshold = 0.5 * H;
  const upperThreshold = (N + 0.5) * H; // Represents N viewports plus offset

  // Wrap virtualScroll if needed.
  if (virtualScroll > upperThreshold) {
    virtualScroll -= N * H;
  } else if (virtualScroll < lowerThreshold) {
    virtualScroll += N * H;
  }

  // Normalize the virtual scroll value over the total virtual scroll area.
  // totalHeight is defined as (gallery.length+2)*H-H as before.
  const normalizedScroll = virtualScroll / totalHeight;
  scrollY = normalizedScroll * (resources.textures.length - 1) - 0.5;
};
