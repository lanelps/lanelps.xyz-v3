<script lang="ts">
  import { onMount } from "svelte";
  import { addCanvasMouseMoveListener } from "@utils/canvas";

  let canvas: HTMLCanvasElement;
  let mouseX = $state(0);
  let mouseY = $state(0);

  const create2DArray = (rows: number, cols: number) => {
    const arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  };

  onMount(() => {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get 2d context");
    }

    const resolution = window.devicePixelRatio || 1;

    // Set the canvas resolution
    const setCanvasResolution = () => {
      canvas.width = canvas.clientWidth * resolution;
      canvas.height = canvas.clientHeight * resolution;

      // Reset the transform matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Scale the context to account for the resolution
      ctx.scale(resolution, resolution);

      // Make canvas background black
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width / resolution, canvas.height / resolution);
    };

    setCanvasResolution();

    // Handle window resize
    window.addEventListener("resize", setCanvasResolution);

    addCanvasMouseMoveListener(canvas, (x, y) => {
      mouseX = x;
      mouseY = y;
    });

    const pixelWidth = 10;
    let grid: number[][];
    let rows: number, cols: number;
    let hue = 1;

    const setup = () => {
      rows = Math.floor(canvas.height / resolution / pixelWidth);
      cols = Math.floor(canvas.width / resolution / pixelWidth);
      grid = create2DArray(rows, cols);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          grid[i][j] = 0;
        }
      }

      grid[0][Math.floor(cols / 2)] = 1; // Place a live cell in the middle of the first row
    };

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width / resolution, canvas.height / resolution);

      if (!grid) return;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const y = i * pixelWidth;
          const x = j * pixelWidth;

          if (grid[i][j] > 0) {
            ctx.beginPath();
            ctx.rect(x, y, pixelWidth, pixelWidth);
            ctx.fillStyle = `hsl(${grid[i][j]}, 100%, 50%)`;
            ctx.fill();
          }
        }
      }

      const nextGrid = create2DArray(rows, cols);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let state = grid[i][j];

          // if it's a live cell
          if (state > 0) {
            // check if it's not the last row
            if (i + 1 < rows) {
              // what's below it?
              let below = grid[i + 1][j];

              // if the cell below is dead
              if (below === 0) {
                // move the current cell down
                nextGrid[i + 1][j] = state;
              } else {
                // otherwise, keep the current cell where it is
                nextGrid[i][j] = state;
              }
            } else {
              // if it's the last row, keep the current cell where it is
              nextGrid[i][j] = state;
            }
          }
        }
      }

      grid = nextGrid;
      requestAnimationFrame(draw);
    };

    setup();
    draw();

    const drawACell = (x: number, y: number) => {
      const i = Math.floor(y / pixelWidth);
      const j = Math.floor(x / pixelWidth);

      if (i >= 0 && i < rows && j >= 0 && j < cols) {
        grid[i][j] = hue;
      }

      hue += 1;
      if (hue > 360) {
        hue = 1;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const interval = setInterval(() => {
        drawACell(mouseX, mouseY);
      }, 1000 / 60);

      const handleMouseMove = (e: MouseEvent) => {
        drawACell(mouseX, mouseY);
      };

      const handleMouseUp = (e: MouseEvent) => {
        clearInterval(interval);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };

      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
    };

    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  });
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
