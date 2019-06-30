
/**
  * 
  * @typedef Brush
  * @property {function()} init
  * @property {function(MouseEvent)} onMousedown
  * @property {function(MouseEvent)} onMousemove
  * @property {function(MouseEvent)} onMouseup
*/

/** @param {Brush} handlers */
function createBrush(handlers) {
  return handlers;
}

function initCanvas({ height, width, style }) {

  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  canvas.width = height;
  canvas.height = width;
  Object.keys(style).forEach(key => {
    canvas.style[key] = style[key];
  });

  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d');

  /** @param {function(CanvasRenderingContext2D)} callback  */
  function draw(callback) {
    ctx.beginPath();
    callback(ctx);
    ctx.closePath();
  }

  const LISTENERS = {
    mousedown: null,
    mousemove: null,
    mouseup: null,
  };

  /**
   * 
   * @param {string} type 
   * @param {function(MouseEvent)} listener 
   */
  function on(type, listener) {
    if (LISTENERS[type]) canvas.removeEventListener(type, LISTENERS[type]);
    LISTENERS[type] = listener;
    canvas.addEventListener(type, LISTENERS[type]);
  }

  /** @param {string} type */
  function off(type) {
    canvas.removeEventListener(type, LISTENERS[type]);
    LISTENERS[type] = null;
  }


  return { draw, on, off };
}
