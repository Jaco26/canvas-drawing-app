  /**
  * 
  * @typedef Brush
  * @property {object} data
  * @property {function()} init
  * @property {function(MouseEvent)} onMousedown
  * @property {function(MouseEvent)} onMousemove
  * @property {function(MouseEvent)} onMouseup
  */  



function initCanvas({ height, width, style }) {

  const listeners = {};

  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  canvas.width = width;
  canvas.height = height;
  Object.keys(style).forEach(key => {
    canvas.style[key] = style[key];
  });

  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d');




  const public = {
    /** @param {function(CanvasRenderingContext2D)} callback  */
    draw: function(callback) {
      ctx.beginPath();
      callback(ctx);
      ctx.closePath();  
    },

    /**
     * 
     * @param {string} type 
     * @param {function(MouseEvent)} listener 
    */
    on: function(type, listener) {
      if (listeners[type]) canvas.removeEventListener(type, listeners[type]);
      listeners[type] = listener;
      canvas.addEventListener(type, listeners[type]);
    },

    /** @param {string} type */
    off: function(type) {
      canvas.removeEventListener(type, listeners[type]);
      listeners[type] = null;
    },

    /** @param {Brush} handlers */
    createBrush: function(handlers) {
      return handlers;
    },

    /** @param {{onMousemove: () => string}} */
    createBrushV2({ onMousemove }) {
      
    },

    getCanvasImage: function() {
      return canvas.toDataURL('image/png');
    }

  }

  return public;
}


/** @type {Brush} */
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
