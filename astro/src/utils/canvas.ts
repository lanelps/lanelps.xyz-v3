type CanvasMouseMoveListener = (
  canvas: HTMLCanvasElement,
  callback: (x: number, y: number) => void
) => void;

export const addCanvasMouseMoveListener: CanvasMouseMoveListener = (
  canvas,
  callback
) => {
  const rect = canvas.getBoundingClientRect();
  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    callback(mouseX, mouseY);
  });
};
