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

  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = 20;

  const redraw = () => {
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = size.value;

    if (points.length === 0) {
      return;
    }

    // draw a basic circle instead
    if (points.length < 6) {
      const point = points[0];
      context.beginPath(),
        context.arc(
          point.x,
          point.y,
          context.lineWidth / 2,
          0,
          Math.PI * 2,
          !0
        ),
        context.closePath(),
        context.fill();
      return;
    }
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    // draw a bunch of quadratics, using the average of two points as the control point
    let i;
    for (i = 1; i < points.length - 2; i++) {
      const c = (points[i].x + points[i + 1].x) / 2,
        d = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    context.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );
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

  const createPoint = (e, dragging) => {
    const x = (e.touches ? e.touches[0] : e).pageX - canvas.offsetLeft;
    const y = (e.touches ? e.touches[0] : e).pageY - canvas.offsetTop;

    return {
      x,
      y,
      color: color.value,
      size: size.value,
      dragging
    };
  };

  const onPress = e => {
    if (e.button === undefined || e.button === 0) {
      isPainting = true;
      points.push(createPoint(e, false));
    }
  };

  const onDrag = e => {
    e.preventDefault();

    if (isPainting) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(memoryCanvas, 0, 0);
      points.push(createPoint(e, true));
      redraw();
    }
  };

  const onRelease = () => {
    if (isPainting) {
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
  // canvas.addEventListener("mouseout", onCancel, false);

  canvas.addEventListener("touchstart", onPress, false);
  canvas.addEventListener("touchmove", onDrag, false);
  canvas.addEventListener("touchend", onRelease, false);
  canvas.addEventListener("touchcancel", onCancel, false);
});
