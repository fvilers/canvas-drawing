const LINE_WIDTH = "round";

const copyCanvas = canvas => {
  const copy = document.createElement("canvas");
  copy.height = canvas.height;
  copy.width = canvas.width;

  return copy;
};

document.addEventListener("DOMContentLoaded", () => {
  const color = document.querySelector("#color");
  const size = document.querySelector("#size");
  const clear = document.querySelector("#clear");
  const canvas = document.querySelector("#canvas");
  const memoryCanvas = copyCanvas(canvas);
  const memoryContext = memoryCanvas.getContext("2d");
  const context = canvas.getContext("2d");
  const points = [];
  let isPainting = false;

  const redraw = () => {
    if (!points.length) {
      return;
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = size.value;
    context.strokeStyle = color.value;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      const x = (point.x + nextPoint.x) / 2;
      const y = (point.y + nextPoint.y) / 2;

      context.quadraticCurveTo(point.x, point.y, x, y);
    }

    context.stroke();
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    memoryContext.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
    points.length = 0;
  };

  const resizeCanvas = () => {
    canvas.height = canvas.clientHeight - 1; // -1 to prevent scrollbars
    canvas.width = canvas.clientWidth;
    memoryCanvas.height = canvas.height;
    memoryCanvas.width = canvas.width;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(memoryCanvas, 0, 0);
    redraw();
  };

  const updateSize = e => {
    size.nextSibling.textContent = `${size.value} px`;
  };

  const createPoint = e => {
    const event = e.touches && e.touches.length ? e.touches[0] : e;
    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;

    return { x, y };
  };

  const onPress = e => {
    if (e.button === undefined || e.button === 0) {
      isPainting = true;
      points.push(createPoint(e));
    }
  };

  const onDrag = e => {
    e.preventDefault();

    if (isPainting) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(memoryCanvas, 0, 0);
      points.push(createPoint(e));
      redraw();
    }
  };

  const onRelease = e => {
    if (isPainting) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(memoryCanvas, 0, 0);
      points.push(createPoint(e));
      redraw();

      isPainting = false;
      memoryContext.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
      memoryContext.drawImage(canvas, 0, 0);
      points.length = 0;
    }
  };

  const onCancel = () => {
    isPainting = false;
    memoryContext.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
    memoryContext.drawImage(canvas, 0, 0);
    points.length = 0;
  };

  // Init
  resizeCanvas();
  updateSize();

  // Event listeners
  window.addEventListener("resize", resizeCanvas);
  size.addEventListener("input", updateSize);
  clear.addEventListener("click", clearCanvas);

  canvas.addEventListener("mousedown", onPress, false);
  canvas.addEventListener("mousemove", onDrag, false);
  canvas.addEventListener("mouseup", onRelease, false);
  canvas.addEventListener("mouseout", onCancel, false);

  canvas.addEventListener("touchstart", onPress, false);
  canvas.addEventListener("touchmove", onDrag, false);
  canvas.addEventListener("touchend", onRelease, false);
  canvas.addEventListener("touchcancel", onCancel, false);
});
