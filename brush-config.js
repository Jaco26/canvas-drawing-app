
/**
 * @typedef BrushConfig
 * @property {Object<string, string|number>} ctxConfig key value pairs used to configure a CanvasRenderingContext2D object
 * @property {(e: MouseEvent) => { func: string, args: Array<string|number>} | { func: string, args: Array<string|number>}[]} drawFunc a callback that recieves a MouseEvent as
 * its arguement and returns an object with:
 * - `func`: the name of a CanvasRenderingContext2D method and,
 * - `args`: the arguments to be passed to that method
 * 
 * @property {Object<string, boolean>} drawOptions key value pairs used to configure which render functions should be called
 * on a CanvasRenderingContext2D object (e.g. `{ fill: true, stroke: false }`)
*/

class Brush {
  /** @param {BrushConfig} */
  constructor({ ctxConfig, drawFunc, drawOptions }) {
    this.ctxConfig = ctxConfig;
    this.drawFunc = drawFunc;
    this.drawOptions = drawOptions
  }
}


/** @type {Object<string, Brush>} */
const brushes = {
  default: new Brush({
    ctxConfig: { fillStyle: '#999', strokeStyle: '#333' },
    drawFunc: e => ({ func: 'rect', args: [e.offsetX, e.offsetY, 10, 10] }),
    drawOptions: { stroke: true },
  }),


  Circle: new Brush({
    ctxConfig: { fillStyle: '#5555ff77'  },
    drawFunc: e => ({ func: 'arc', args: [e.offsetX, e.offsetY, 10, 0, Math.PI * 2]}),
    drawOptions: { fill: true },
  }),

  'Orange and blue': {
    ctxConfig: {
      fillStyle: 'orange',
      strokeStyle: 'blue',
      filter: 'opacity(50%)'
    },
    drawFunc: e => ({ func: 'rect', args: [e.offsetX, e.offsetY, 30, 30] }),
    drawOptions: {
      fill: true,
      stroke: true,
    }
  },

  mirror: {
    ctxConfig: {
      fillStyle: '#999',
      strokeStyle: '#333',
    },
    drawFunc: e => ([
      { func: 'rect', args: [e.offsetX, e.offsetY, 5, 5]},
      { func: 'rect', args: [e.offsetY, e.offsetX, 5, 5]},
    ]),
    drawOptions: {
      fill: true,
      stroke: true,
    }
  },
  
  weird: {
    ctxConfig: {
      fillStyle: '#6694',
      strokeStyle: 'lime',
    },
    drawFunc: e => ([
      { func: 'rect', args: [e.offsetX / 1.5, e.offsetY * 1.5, 5, 5] }
    ]),
    drawOptions: {
      fill: true,
      stroke: true,
    }
  }
};