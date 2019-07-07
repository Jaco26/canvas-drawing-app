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
    onMousemove: (e, config) => {
      const ret = [
        func('beginPath'),
        func('rect', e.offsetX, e.offsetY, config.brushSize * config.xMod, config.brushSize * config.yMod)
      ];
      if (config.mirror) {
        ret.push(
          func('rect', e.offsetY, e.offsetX, config.brushSize * config.xMod, config.brushSize * config.yMod)
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
        c('div',
          { style: { margin: '0.6rem 0' }},
          [
            c('label', ['Fill Style: ']),
            c('input',
              { 
                attrs: { type: 'color', value: ctxOptions.fillStyle }, 
                on: { input: e => ctxOptions.fillStyle = e.target.value }
              }
            ),
          ]
        ),
        c('div',
          { style: { margin: '0.6rem 0' }},
          [
            c('label', ['Stroke Style: ']),
            c('input',
              { 
                attrs: { type: 'color', value: ctxOptions.strokeStyle }, 
                on: { input: e => ctxOptions.strokeStyle = e.target.value }
              }
            ),
          ]
        ),
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