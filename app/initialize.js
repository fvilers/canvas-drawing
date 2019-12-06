const LINE_WIDTH = "round";

document.addEventListener("DOMContentLoaded", () => {
  const color = document.querySelector("#color");
  const size = document.querySelector("#size");
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  const points = [];
  let isPainting = false;

  const redraw = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.lineJoin = LINE_WIDTH;

    let previousPoint = null;

    for (const point of points) {
      context.beginPath();
      context.strokeStyle = point.color;
      context.lineWidth = point.size;

      if (point.dragging && previousPoint) {
        context.moveTo(previousPoint.x, previousPoint.y);
      } else {
        context.moveTo(point.x - 1, point.y);
      }

      context.lineTo(point.x, point.y);
      context.closePath();
      context.stroke();
      previousPoint = point;
    }
  };

  const resizeCanvas = () => {
    canvas.height = canvas.clientHeight - 1; // -1 to prevent scrollbars
    canvas.width = canvas.clientWidth;
    redraw();
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const stopPainting = () => {
    isPainting = false;
  };

  const updateSize = e => {
    size.nextSibling.textContent = `${size.value} px`;
  };

  updateSize();
  size.addEventListener("input", updateSize);

  canvas.addEventListener("mousedown", e => {
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;

    isPainting = true;
    points.push({
      x,
      y,
      color: color.value,
      size: size.value,
      dragging: false
    });
    redraw();
  });
  canvas.addEventListener("mousemove", e => {
    if (isPainting) {
      const x = e.pageX - canvas.offsetLeft;
      const y = e.pageY - canvas.offsetTop;

      points.push({
        x,
        y,
        color: color.value,
        size: size.value,
        dragging: true
      });
      redraw();
    }
  });
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
});
