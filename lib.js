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
      this.directives = {
        mousedown: [],
        mousemove: [],
        mouseup: [],
      };
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
   * @typedef Brush
   * @property {function(MouseEvent)} onMousedown
   * @property {function(MouseEvent)} onMousemove
   * @property {function(MouseEvent)} onMouseup
  */

  /** @param {Brush} config */
  function createBrush(config) {
    return {
      onMousedown: config.onMousedown ? config.onMousedown : () => [],
      onMousemove: config.onMousemove ? config.onMousemove : () => [],
      onMouseup: config.onMouseup ? config.onMouseup : () => [],
    }
  }

  /**
   * 
   * @typedef drawOptions
   * @property {number} brushSize
   * @property {number} xMod
   * @property {number} yMod
   * @property {number} rMod
   */

  /**
   * 
   * @param {{
   *  selector: string,
   *  width: number,
   *  height: number,
   *  ctxOptions: Object<string, boolean | string>
   *  drawOptions: Object<string, string | number>
   * }} config
   */
  function createApp(config) {
    const canvas = new Canvas(config.selector);
    canvas.width = config.width;
    canvas.height = config.height;
    const pathManager = new PathManager();
    let selectedBrush = null;
    let backgroundColor = null;

    canvas.on('mousedown', e => {
      pathManager.createPath({ ...config.ctxOptions });

      const { strokeStyle, fillStyle } = pathManager.currentPath.config;
      canvas.ctx.strokeStyle = strokeStyle;
      canvas.ctx.fillStyle = fillStyle;
      
      selectedBrush.onMousedown(e, config.drawOptions).forEach(directive => {
        canvas.ctx[directive.func](...directive.args);
        pathManager.currentPath.directives.mousedown.push(directive);
        if (pathManager.currentPath.config.fill) canvas.ctx.fill();
        if (pathManager.currentPath.config.stroke) canvas.ctx.stroke();
      })
    
      canvas.on('mousemove', e => {
        selectedBrush.onMousemove(e, config.drawOptions).forEach(directive => {
          canvas.ctx[directive.func](...directive.args);
          pathManager.currentPath.directives.mousemove.push(directive);
          if (pathManager.currentPath.config.fill) canvas.ctx.fill();
          if (pathManager.currentPath.config.stroke) canvas.ctx.stroke();
        })
      });
    });
    
    canvas.on('mouseup', e => {
      canvas.off('mousemove');
      selectedBrush.onMouseup(e).forEach(directive => {
        canvas.ctx[directive.func](...directive.args);
        pathManager.currentPath.directives.mouseup.push(directive);
      })
      pathManager.endPath();
    });

    function redrawHistory() {
      if (backgroundColor) {
        canvas.ctx.fillStyle = backgroundColor;
        canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      pathManager.history.forEach(path => {
        canvas.ctx.fillStyle = path.config.fillStyle;
        canvas.ctx.strokeStyle = path.config.strokeStyle;
        path.directives.mousedown.forEach(directive => {
          canvas.ctx[directive.func](...directive.args);
        });
        path.directives.mousemove.forEach(directive => {
          canvas.ctx[directive.func](...directive.args);
          if (path.config.fill) canvas.ctx.fill();
          if (path.config.stroke) canvas.ctx.stroke();
        });
        path.directives.mouseup.forEach(directive => {
          canvas.ctx[directive.func](...directive.args);
        });
      })
    }

    function setBackground(color) {
      backgroundColor = color;
      redrawHistory();
    }

    function setBrush(brush) {
      selectedBrush = brush;
    }

    function undo() {
      canvas.clear();
      pathManager.popPath();
      redrawHistory();
    }

    function canvasToDataUrl(type) {
      return canvas.canvas.toDataURL(type);
    }

    

    return { setBackground, pathManager, setBrush, undo, canvasToDataUrl };
  }

  return {
    createApp,
    createBrush,
  }

})();
