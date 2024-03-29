const { createApp, createBrush } = DrawingApp;
const { render, createElement } = ThanksBeToVue;

const ctxOptions = {
  fill: true,
  stroke: true,
  strokeStyle: '#000000',
  fillStyle: '#ffffff',
}

const drawOptions = {
  brushSize: 10,
  mirror: false,
  xMod: 2,
  yMod: 2,
  rMod: 1,
}

function func(func, ...args) {
  return { func, args };
}

const brushes = {
  arc: createBrush({
    onMousedown: (e, config) => {
      const ret = [
        func('beginPath'),
        func('arc', e.offsetX, e.offsetY, config.brushSize * config.rMod, 0, Math.PI * 2),
        func('closePath'),
      ];
      if (config.mirror) {
        ret.push(
          func('beginPath'),
          func('arc', e.offsetY, e.offsetX, config.brushSize * config.rMod, 0, Math.PI * 2),
          func('closePath'),
        );
      }
      return ret;
    },
    onMousemove: (e, config) => {
      const ret = [
        func('beginPath'),
        func('arc', e.offsetX, e.offsetY, config.brushSize * config.rMod, 0, Math.PI * 2),
        func('closePath'),
      ];
      if (config.mirror) {
        ret.push(
          func('beginPath'),
          func('arc', e.offsetY, e.offsetX, config.brushSize * config.rMod, 0, Math.PI * 2),
          func('closePath')
        );
      }
      return ret;
    }
  }),
  rect: createBrush({
    onMousedown: (e, config) => {
      const width = config.brushSize * config.xMod;
      const height = config.brushSize * config.yMod;
      const x = e.offsetX - (width / 2);
      const y = e.offsetY - (height / 2);
      const ret = [
        func('beginPath'),
        func('rect', x, y, width, height)
      ];
      if (config.mirror) {
        ret.push(
          func('rect', y, x, width, height)
        );
      }
      ret.push(func('closePath'));
      return ret;
    },
    onMousemove: (e, config) => {
      const width = config.brushSize * config.xMod;
      const height = config.brushSize * config.yMod;
      const x = e.offsetX - (width / 2);
      const y = e.offsetY - (height / 2);
      const ret = [
        func('beginPath'),
        func('rect', x, y, width, height)
      ];
      if (config.mirror) {
        ret.push(
          func('rect', y, x, width, height)
        );
      }
      ret.push(func('closePath'));
      return ret;
    },
  }),
  line: {
    onMousedown: (e, config) => ([
      func('beginPath'),
      func('moveTo', e.offsetX, e.offsetY),
    ]),
    onMousemove: (e, config) => {
      return [
        func('lineTo', e.offsetX, e.offsetY)
      ];
    },
    onMouseup: e => ([
      func('closePath'),
    ])
  },
};

const app = createApp({
  selector: '#canvas',
  width: 700,
  height: 700,
  ctxOptions,
  drawOptions,
});

app.setBrush(brushes.arc)

function renderToolbar() {
  render('#toolbar', c => (
    c('div',
      { style: { padding: '0.5rem', display: 'flex', alignItems: 'center' }},
      [
        c('h1', { style: { padding: 0, margin: 0, fontWeight: 400 }}, ['Hey Neat!']),
        c('div', { style: { margin: 'auto'}}),
        c('button',
          {
            style: { margin: '0 5px', height: '30px', width: '90px', fontSize: '1rem' },
            on: { click: () => app.undo() }
          },
          ['Undo']
        ),
        c('button',
          {
            style: { margin: '0 5px', height: '30px', fontSize: '1rem' },
          },
          [
            c('a',
              {
                attrs: { download: 'my-drawing.png', href: app.canvasToDataUrl('image/png') },
                on: { 
                  click: function() {
                    this.href = app.canvasToDataUrl('image/png');
                  }
                }
              },
              ['Save your work']
            )
          ]
        )
      ]
    )
  ))
}

function renderSidebar() {
  render('#sidebar', c => (
    c('div',
      { style: { padding: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '200px' }},
      [
        c('div',
          { style: { margin: '0.6rem 0' }},
          [
            c('label', { attrs: { id: 'range-label' }}, [`Brush size: ${drawOptions.brushSize} `]),
            c('input',
              {
                attrs: { type: 'range', min: 1, max: 20, value: drawOptions.brushSize },
                on: { 
                  input: e => {
                    drawOptions.brushSize = e.target.value;
                    document.getElementById('range-label').textContent = `Brush size: ${drawOptions.brushSize} `;
                  }
                }
              }
            ),
          ]
        ),
        c('div',
          { style: { margin: '0.6rem 0' }},
          [
            c('label', ['Brush variant: ']),
            c('select',
              { 
                on: { change: e => {
                  const brushName = e.target.value;
                  const fillCB = document.querySelector('#fill-toggle');
                  const strokeCB = document.querySelector('#stroke-toggle');
                  if (brushName === 'line') {
                    fillCB.checked = false;
                    fillCB.disabled = true;
                    ctxOptions.fill = false;
                  } else {
                    fillCB.checked = true;
                    fillCB.disabled = false;
                    ctxOptions.fill = true;
                  }
                  app.setBrush(brushes[brushName]);
                }}
              },
              Object.keys(brushes).map((key, i) => c('option', 
                { attrs: { value: key }}, 
                [key[0].toUpperCase(), key.slice(1).toLowerCase()]
              )),
            ),
          ]
        ),
        createInput({
          labelText: 'Background color: ',
          id: 'background-color-input',
          type: 'color',
          value: '#ffffff',
          onInput: e => app.setBackground(e.target.value),
        }),
        createInput({
          labelText: 'Fill style: ',
          id: 'fill-style-input',
          type: 'color',
          value: ctxOptions.fillStyle,
          onInput: e => ctxOptions.fillStyle = e.target.value,
        }),
        createInput({
          labelText: 'Stroke style: ',
          id: 'stroke-style-input',
          type: 'color',
          value: ctxOptions.strokeStyle,
          onInput: e => ctxOptions.strokeStyle = e.target.value
        }),
        c('ul',
          { style: { listStyle: 'none', margin: '0.6rem 0', padding: 0 }},
          [
            c('li',
              [
                c('label', { attrs: { for: 'fill-toggle'}}, ['Fill: ']),
                c('input',
                  { 
                    attrs: { type: 'checkbox', checked: ctxOptions.fill, id: 'fill-toggle' },
                    on: { input: () => ctxOptions.fill = !ctxOptions.fill }
                  }
                )
              ]
            ),
            c('li',
              [
                c('label', { attrs: { for: 'stroke-toggle'}}, ['Stroke: ']),
                c('input',
                  { 
                    attrs: { type: 'checkbox', checked: ctxOptions.stroke, id: 'stroke-toggle' },
                    on: { input: () => ctxOptions.stroke = !ctxOptions.stroke }
                  }
                )
              ]
            ),
            c('li',
              [
                c('label', { attrs: { for: 'mirror-toggle'}}, ['Mirror Mode: ']),
                c('input',
                  { 
                    attrs: { type: 'checkbox', id: 'mirror-toggle'},
                    on: { input: () => drawOptions.mirror = !drawOptions.mirror }
                  }
                )
              ]
            )
          ]
        ),
      ]
    )
  ))
}

renderToolbar();
renderSidebar();