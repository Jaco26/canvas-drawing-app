
function initCanvas({ height, width, style }) {

  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  canvas.width = width;
  canvas.height = height;
  Object.keys(style).forEach(key => {
    canvas.style[key] = style[key];
  });

  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d');

  function getCanvasImage() {
    return canvas.toDataURL('image/png');
  }

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

  /**
  * 
  * @typedef Brush
  * @property {object} data
  * @property {function()} init
  * @property {function(MouseEvent)} onMousedown
  * @property {function(MouseEvent)} onMousemove
  * @property {function(MouseEvent)} onMouseup
  */  


  /** @param {Brush} handlers */
  function createBrush(handlers) {
    return handlers;
  }

  return { draw, on, off, createBrush, getCanvasImage };
}

const defaultConfig = {
  init() {
    on('mousedown', () => this.onMousedown());
    on('mouseup', () => this.onMouseup());
  },
  onMousemove() {
    console.log('You must provide your own implementation of onMousemove');
  },
  onMousedown() {
    on('mousemove', e => this.onMousemove(e));
  },
  onMouseup() {
    off('mousemove');
  },
};
