const DrawingApp = (function() {
  /**
   * @typedef PathConfig
   * @property {boolean} fill
   * @property {boolean} stroke
   * @property {string} fillStyle
   * @property {string} strokeStyle
  */

  class Path {
    /**
     * 
     * @param {PathConfig} config 
     */
    constructor(config) {
      this.directives = [];
      this.config = config
    }
  }


  class Canvas {
    constructor(selector) {
      /** @type {HTMLCanvasElement} */
      this.canvas = document.querySelector(selector);
      /** @type {CanvasRenderingContext2D} */
      this.ctx = this.canvas.getContext('2d');
      /** @type {Object<string, (e: MouseEvent)>} */
      this.listeners = {};
    }

    get width() { return this.canvas.width }
    set width(val) { this.canvas.width = val }

    get height() { return this.canvas.height }
    set height(val) { this.canvas.height = val }

    get style() { return this.canvas.style }
    set style(val) { 
      Object.keys(val).forEach(key => {
        this.canvas.style.setProperty(key, val[key])
      });
    }

    /**
     * 
     * @param {string} type 
     * @param {function(MouseEvent)} listener 
    */
    on(type, listener) {
      if (this.listeners[type]) {
        this.canvas.removeEventListener(type, this.listeners[type]);
      }
      this.listeners[type] = listener;
      this.canvas.addEventListener(type, this.listeners[type]);
    }

    off(type) {
      this.canvas.removeEventListener(type, this.listeners[type]);
      this.listeners[type] = null;
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }


  class PathManager {
    constructor() {
      this.history = [];
      this.currentPath = null;
    }

    /** @param {PathConfig} config */
    createPath(config) {
      this.currentPath = new Path(config)
    }

    endPath() {
      this.history.push(this.currentPath);
      this.currentPath = null;
    }

    popPath() {
      this.history.pop();
    }
  }

  /**
   * 
   * @typedef BrushCallback
   * @property {MouseEvent} evt
   * @property {CanvasRenderingContext2D} ctx
   * @property {Path} currentPath
   */

  /**
   * @typedef Brush
   * @property {function(BrushCallback)} onMousedown
   * @property {function(BrushCallback)} onMousemove
   * @property {function(BrushCallback)} onMouseup
  */

  /**
   * 
   * @param {{
   *  selector: string,
   *  width: number,
   *  height: number,
   *  pathCtxOptions: Object<string, boolean | string>
   * }} config
   */
  function createApp(config) {
    const canvas = new Canvas(config.selector);
    canvas.width = config.width;
    canvas.height = config.height;
    const pathManager = new PathManager();
    let selectedBrush = null;

    canvas.on('mousedown', e => {
      pathManager.createPath(config.ctxOptions);

      const { strokeStyle, fillStyle } = pathManager.currentPath.config;
      canvas.ctx.strokeStyle = strokeStyle;
      canvas.ctx.fillStyle = fillStyle;
    
      selectedBrush.onMousedown({
        evt: e,
        ctx: canvas.ctx, 
        currentPath: pathManager.currentPath
      });
    
      canvas.on('mousemove', e => {
        selectedBrush.onMousemove({
          evt: e,
          ctx: canvas.ctx, 
          currentPath: pathManager.currentPath,
        });
        if (pathManager.currentPath.config.fill) canvas.ctx.fill();
        if (pathManager.currentPath.config.stroke) canvas.ctx.stroke();
      });
    });
    
    canvas.on('mouseup', e => {
      canvas.off('mousemove');
      selectedBrush.onMouseup({
        evt: e,
        ctx: canvas.ctx, 
        currentPath: pathManager.currentPath,
      });
      pathManager.endPath();
    });

    function setBrush(brush) {
      selectedBrush = brush;
    }

    return { setBrush };
  }


  /** @param {Brush} config */
  function createBrush(config) {
    return {
      onMousedown: config.onMousedown ? config.onMousedown : () => null,
      onMousemove: config.onMousemove ? config.onMousemove : () => null,
      onMouseup: config.onMouseup ? config.onMouseup : () => null,
    }
  }

  return {
    createApp,
    createBrush,
  }

})();
