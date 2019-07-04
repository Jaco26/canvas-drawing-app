const canvasManager = (function() {


  class Path {
    /** 
     * @param {Object<string, string | number>} ctxConfig 
     * @param {Object<string, boolean>} drawFuncs
    */
    constructor(ctxConfig, drawOptions) {
      this.path = new Path2D();
      this.ctxConfig = ctxConfig;
      this.drawOptions = drawOptions;
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
      /** @type {Path[]} */
      this.history = [];
      /** @type {Path | null} */
      this.currentPath = null;
    }

    get width() { return this.canvas.width }
    set width(val) { this.canvas.width = val }

    get height() { return this.canvas.height }
    set height(val) { this.canvas.height = val }

    get style() { return this.canvas.style }
    set style(val) { 
      Object.keys(val).forEach(key => {
        this.canvas.style.setProperty(key, val[key])
      })  
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

    // /** @param {function(Path2D)} callback */
    // draw(callback) {
    //   const { drawOptions, path } = this.currentPath;
    //   callback(path)
    //   if (drawOptions.fill) this.ctx.fill(path);
    //   if (drawOptions.stroke) this.ctx.stroke(path);
    // }
    /** @param {function() => Object<string, any[]>} callback */
    draw(callback) {
      const { drawOptions, path } = this.currentPath;
      const config = callback();
      Object.keys(config).forEach(key => {
        path[key](...config[key]);
        this.ctx[key](...config[key]);
      });
      if (drawOptions.fill) this.ctx.fill(path);
      if (drawOptions.stroke) this.ctx.stroke(path);
    }

    /**
     * 
     * @param {{ctxConfig: Object<string, string>, drawOptions: Object<string, boolean>}} param0 
     */
    createPath({ ctxConfig, drawOptions }) {
      this.currentPath = new Path(ctxConfig, drawOptions);
    }

    endPath() {
      this.history.push(this.currentPath);
      this.currentPath = null;
    }

    popPath() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.history.pop();
      this.drawHistory()
    }

    drawHistory() {
      this.history.forEach(p => {
        Object.keys(p.ctxConfig).forEach(key => {
          this.ctx[key] = p.ctxConfig[key];
        });
        if (p.drawOptions.fill) this.ctx.fill(p.path);
        if (p.drawOptions.stroke) this.ctx.stroke(p.path);
      })

    }
  }

  return { Canvas }

})();

