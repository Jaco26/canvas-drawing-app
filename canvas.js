const canvasManager = (function() {

  class Directive {
    /**
     * 
     * @param {string} func the name of a function to be executed by a `CanvasRenderingContext2D`
     * @param {Array<string | number>} args the arguments to pass to that function
     */
    constructor(func, args) {
      this.func = func;
      this.args = args;
    }
  }


  class Path {
    /** 
     * @param {Object<string, string | number>} ctxConfig 
     * @param {Object<string, boolean>} drawFuncs
    */
    constructor(ctxConfig, drawOptions) {
      this.path = new Path2D();
      /** @type {Directive[]} */
      this.directives = [];
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

    /** @param {function() => Object<string, any[]>} callback */
    draw(callback) {
      const { drawOptions, path } = this.currentPath;
      const config = callback();
      /** @type {Directive[]} */
      const newDirectives = [];
      if (Array.isArray(config)) {
        if (typeof config[0] === 'string') {
          const [func, args] = config;
          newDirectives.push(new Directive(func, args));
        } else {
          config.forEach(item => {
            newDirectives.push(new Directive(item.func, item.args))
          });
        }
      } else if (config && typeof config === 'object') {
        newDirectives.push(new Directive(config.func, config.args))
      }
      
      this.render(newDirectives, drawOptions);
      this.currentPath.directives.push(...newDirectives);
    }

    render(directives, drawOptions) {
      directives.forEach(directive => {
        this.ctx.beginPath();
        this.ctx[directive.func](...directive.args);
        if (drawOptions.fill) this.ctx.fill();
        if (drawOptions.stroke) this.ctx.stroke();
        this.ctx.closePath();
      });
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
      const start = Date.now();
      this.history.forEach(p => {
        Object.keys(p.ctxConfig).forEach(key => {
          this.ctx[key] = p.ctxConfig[key];
        });
        this.render(p.directives, p.drawOptions);
      });
      debugLog(`duration: ${Date.now() - start} milliseconds`)
    }
  }

  return { Canvas }

})();

