const { createApp, createBrush } = DrawingApp;
const { render, createElement } = ThanksBeToVue;

const ctxOptions = {
  fill: false,
  stroke: true,
  strokeStyle: 'orange',
  fillStyle: 'blue',
}

const drawOptions = {
  brushSize: 10,
  xMod: 2,
  yMod: 2,
  rMod: 1,
}

function func(func, ...args) {
  return { func, args };
}

const brushes = {
  line: {
    onMousedown: e => ([
      func('beginPath'),
      func('moveTo', e.offsetX, e.offsetY),
    ]),
    onMousemove: e => ([
      func('lineTo', e.offsetX, e.offsetY)
    ]),
    onMouseup: e => ([
      func('closePath'),
    ])
  },
  rect: createBrush({
    onMousemove: (e, config) => ([
      func('beginPath'),
      func('rect', e.offsetX, e.offsetY, config.brushSize * config.xMod, config.brushSize * config.yMod)
    ]),
  }),
  arc: createBrush({
    onMousemove: (e, config) => ([
      func('beginPath'),
      func('arc', e.offsetX, e.offsetY, config.brushSize * config.rMod, 0, Math.PI * 2),
      func('closePath'),
    ]),
  }),
}

const app = createApp({
  selector: '#canvas',
  width: 700,
  height: 700,
  ctxOptions,
  drawOptions,
});

app.setBrush(brushes.line)

function renderToolbar() {
  render('#toolbar', c => (
    c('div',
      { style: { padding: '0.5rem', display: 'flex', alignItems: 'center' }},
      [
        c('h1', { style: { padding: 0, margin: 0}}, ['DRAW!']),
        c('div', { style: { margin: 'auto'}}),
        c('button',
          {
            style: { margin: '0 5px', height: '30px', width: '90px', fontSize: '1rem' },
            on: { click: () => app.undo() }
          },
          ['Undo']
        ),
      ]
    )
  ))
}

renderToolbar()
