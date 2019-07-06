
let selectedBrush = brushes.default;

let brushVariants = [
  { 
    text: 'Rectangle',
    drawFunc: (e, config) => {
      const width = config.brushSize * config.xModifier;
      const height = config.brushSize * config.yModifier;
      return {
        func: 'rect',
        args: [
          e.offsetX - (width / 2),
          e.offsetY - (height / 2),
          width,
          height,
        ]
      }
    },
  },
  {
    text: 'Arc',
    drawFunc: (e, config) => ({
      func: 'arc',
      args: [
        e.offsetX,
        e.offsetY,
        config.brushSize * config.rModifier,
        0,
        Math.PI * 2
      ]
    })
  },
];

// let selectedBrushVariant = brushVariants[0];

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
  xModifier: 1,
  yModifier: 1,
  rModifier: 1,
  fillStyle: '',
  strokeStyle: '',
  shouldFill: true,
  shouldStroke: true,
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

const canvas = new canvasManager.Canvas('#canvas');
canvas.width = 700;
canvas.height = 700;

canvas.on('mousedown', mdE => {
  canvas.createPath(brush);

  Object.entries(canvas.currentPath.ctxConfig).forEach(([key, value]) => {
    canvas.ctx[key] = value;
  });

  // canvas.draw(() => selectedBrush.drawFunc(mdE, brushSize));
  canvas.draw(() => brush.drawFunc(mdE, config));

  canvas.on('mousemove', mmE => {
    // canvas.draw(() => selectedBrush.drawFunc(mmE, brushSize));
    canvas.draw(() => brush.drawFunc(mmE, config));
  });
});

canvas.on('mouseup', () => {
  canvas.endPath();
  canvas.off('mousemove');
});


const { render, createElement } = ThanksBeToVue;

function renderToolbar() {
  render('#toolbar', c => {
    return renderCard(c => (
      c('div', 
        {
          style: { display: 'flex', alignItems: 'center' }
        },
        [
          c('h1', { style: { margin: 0, padding: 0 }}, ['Drawing Is Fun!']),
          c('div', { style: { margin: 'auto'}}, ['']),
          c('div', { style: { margin: '0 5px' }}, ['Select a brush']),
          c('select',
            {
              on: { change: e => selectedBrush = brushes[e.target.value] },
            },
            Object.keys(brushes).map(key => {
              return c('option', 
                { 
                  attrs: { 
                    value: key
                  },
                },
                [key]
              )
            })
          ),
          c('button', 
            {
              style: { margin: '0 5px' },
              on: { click: () => canvas.popPath() }
            },
            ['Undo']
          )
        ]
      ) 
    ));
  });
}



function renderSidebar() {
  render('#sidebar', c => {
    return renderCard(c => (
      c('div',
        { style: { width: '300px' }}, 
        [
          c('label', { attrs: { id: 'range-label' }}, [brushSizeLabelDisplay()]),
          c('input',
            {
              attrs: { type: 'range', min: 1, max: 20, value: config.brushSize },
              on: { 
                input: e => {
                  config.brushSize = e.target.value;
                  document.getElementById('range-label').textContent = brushSizeLabelDisplay();
                }
              }
            }
          ),
          c('br'),
          c('br'),
          c('label', ['Fill Style: ']),
          c('input',
            { 
              attrs: { type: 'color', value: '#aaa' }, 
              on: {
                input: e => config.fillStyle = e.target.value,
              }
            }
          ),
          c('br'),
          c('br'),
          c('label', ['Stroke Style: ']),
          c('input',
            {
              attrs: { type: 'color', value: '#aaa' }, 
              on: {
                input: e => config.strokeStyle = e.target.value,
              }
            }
          )
        ]
      )
    ))
  })
}


renderToolbar();
renderSidebar();

