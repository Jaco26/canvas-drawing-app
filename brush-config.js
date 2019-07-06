
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
  constructor({ ctxConfig, drawFunc, drawOptions } = {}) {
    this.ctxConfig = ctxConfig;
    this.drawFunc = drawFunc;
    this.drawOptions = drawOptions
  }
}


let brushVariants = [
  { 
    text: 'Rectangle',
    drawFunc: (e, config) => {
      const width = config.brushSize * config.xModifier;
      const height = config.brushSize * config.yModifier;
      const ret = [
        { func: 'rect',
          args: [e.offsetX - (width / 2), e.offsetY - (height / 2), width,height]
        }
      ]
      if (config.mirror) {
        ret.push({
          func: 'rect',
          args: [e.offsetY - (width / 2), e.offsetX - (height / 2), width,height]
        })
      }
      return ret;
    },
  },
  {
    text: 'Arc',
    drawFunc: (e, config) => {
      const ret = [
        { 
          func: 'arc', 
          args: [e.offsetX, e.offsetY, config.brushSize * config.rModifier, 0, Math.PI * 2] 
        },
      ];
      if (config.mirror) {
        ret.push({
          func: 'arc',
          args: [e.offsetY, e.offsetX, config.brushSize * config.rModifier, 0, Math.PI * 2],
        })
      }
      return ret;
    }
  },
];




function createBrushConfig(config) {
  return Object.keys(config).reduce((acc, key) => {
    let internalValue = config[key];
    Object.defineProperty(acc, key, {
      get: () => internalValue,
      set: newVal => {
        internalValue = newVal;
        updateBrush();
      }
    });
    return acc;
  }, {});
}

const config = createBrushConfig({
  brushSize: 5,
  xModifier: 4,
  yModifier: 4,
  rModifier: 2,
  fillStyle: '#fff',
  strokeStyle: '#000',
  shouldFill: true,
  shouldStroke: true,
  mirror: false,
  brushVariant: brushVariants[0],
});

const brushSizeLabelDisplay = () => `Brush size: ${config.brushSize} `;


const brush = new Brush();

function updateBrush() {
  brush.drawFunc = config.brushVariant.drawFunc;
  brush.ctxConfig = {
    fillStyle: config.fillStyle,
    strokeStyle: config.strokeStyle,
  },
  brush.drawOptions = {
    fill: config.shouldFill,
    stroke: config.shouldStroke,
  }
}

updateBrush();
