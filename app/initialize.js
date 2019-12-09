const LINE_WIDTH = 'round';

document.addEventListener('DOMContentLoaded', () => {
  const color = document.querySelector('#color');
  const size = document.querySelector('#size');
  const clear = document.querySelector('#clear');
  const canvas = document.querySelector('#canvas');
  const context = canvas.getContext('2d');
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

  const clearCanvas = () => {
    points.length = 0;
    window.requestAnimationFrame(redraw);
  };

  const resizeCanvas = () => {
    canvas.height = canvas.clientHeight - 1; // -1 to prevent scrollbars
    canvas.width = canvas.clientWidth;
    window.requestAnimationFrame(redraw);
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
      window.requestAnimationFrame(redraw);
    }
  };

  const onDrag = e => {
    e.preventDefault();

    if (isPainting) {
      points.push(createPoint(e, true));
      window.requestAnimationFrame(redraw);
    }
  };

  const onRelease = () => {
    isPainting = false;
    window.requestAnimationFrame(redraw);
  };

  const onCancel = () => {
    isPainting = false;
  };

  // Init
  resizeCanvas();
  updateSize();

  // Event listeners
  window.addEventListener('resize', resizeCanvas);
  size.addEventListener('input', updateSize);
  clear.addEventListener('click', clearCanvas);

  canvas.addEventListener('mousedown', onPress, false);
  canvas.addEventListener('mousemove', onDrag, false);
  canvas.addEventListener('mouseup', onRelease, false);
  canvas.addEventListener('mouseout', onCancel, false);

  canvas.addEventListener('touchstart', onPress, false);
  canvas.addEventListener('touchmove', onDrag, false);
  canvas.addEventListener('touchend', onRelease, false);
  canvas.addEventListener('touchcancel', onCancel, false);
});
