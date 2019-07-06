
const canvas = new canvasManager.Canvas('#canvas');
canvas.width = 700;
canvas.height = 700;

canvas.on('mousedown', mdE => {
  
  canvas.createPath(brush);

  Object.entries(canvas.currentPath.ctxConfig).forEach(([key, value]) => {
    canvas.ctx[key] = value;
  });

  canvas.draw(() => brush.drawFunc(mdE, config));

  canvas.on('mousemove', mmE => {
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
          c('button', 
            {
              style: { margin: '0 5px', height: '30px', width: '90px', fontSize: '1rem' },
              on: { click: () => canvas.popPath() }
            },
            ['Undo']
          ),
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
          c('br'),c('br'),
          c('label', ['Brush variant: ']),
          c('select',
            { 
              on: { change: e => config.brushVariant = brushVariants[e.target.value] }
            },
            brushVariants.map((x, i) => c('option', { attrs: { value: i }}, [x.text]))
          ),
          c('br'),c('br'),
          c('label', ['Fill Style: ']),
          c('input',
            { 
              attrs: { type: 'color', value: '#ffffff' }, 
              on: { input: e => config.fillStyle = e.target.value }
            }
          ),
          c('br'),c('br'),
          c('label', ['Stroke Style: ']),
          c('input',
            {
              attrs: { type: 'color' }, 
              on: { input: e => config.strokeStyle = e.target.value }
            }
          ),
        ]
      )
    ))
  })
}


renderToolbar();
renderSidebar();

