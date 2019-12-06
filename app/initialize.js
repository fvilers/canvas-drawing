const STROKE_STYLE = "black";
const POINT_SIZE = 2;
const LINE_WIDTH = "round";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  const points = [];
  let isPainting = false;

  const redraw = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = STROKE_STYLE;
    context.lineJoin = LINE_WIDTH;
    context.lineWidth = POINT_SIZE;

    let previousPoint = null;

    for (var i = 0; i < points.length; i++) {
      const point = points[i];

      if (point.dragging && previousPoint) {
        context.beginPath();
        context.moveTo(previousPoint.x, previousPoint.y);
        context.lineTo(point.x, point.y);
        context.closePath();
        context.stroke();
      } else {
        context.fillRect(point.x, point.y, POINT_SIZE, POINT_SIZE);
      }

      previousPoint = point;
    }
  };

  const handlePoint = e => {
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;

    isPainting = true;
    points.push({ x, y });
    redraw();
  };

  const stopPainting = () => {
    isPainting = false;
  };

  canvas.addEventListener("mousedown", handlePoint);
  canvas.addEventListener("mousemove", e => {
    if (isPainting) {
      handlePoint(e);
    }
  });
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
});
