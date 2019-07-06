
let selectedBrush = brushes.default;

let brushSize = 5;
const brushSizeLabelDisplay = () => `Brush size: ${brushSize} `;

const canvas = new canvasManager.Canvas('#canvas');
canvas.width = 700;
canvas.height = 700;

canvas.on('mousedown', mdE => {
  canvas.createPath(selectedBrush);

  Object.entries(canvas.currentPath.ctxConfig).forEach(([key, value]) => {
    canvas.ctx[key] = value;
  });

  canvas.draw(() => selectedBrush.drawFunc(mdE, brushSize));

  canvas.on('mousemove', mmE => {
    canvas.draw(() => selectedBrush.drawFunc(mmE, brushSize));
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
        {
          style: { 
            width: '300px',
          } 
        }, 
        [
          c('label', { attrs: { id: 'range-label' }}, [brushSizeLabelDisplay()]),
          c('input',
            {
              attrs: { type: 'range', min: 1, max: 20, value: brushSize },
              on: { 
                input: e => {
                  brushSize = e.target.value;
                  document.getElementById('range-label').textContent = brushSizeLabelDisplay();
                }
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

