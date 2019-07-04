

const brushes = {
  default: {
    ctxConfig: {
      fillStyle: '#999',
      strokeStyle: '#333',
    },
    drawOptions: {
      fill: false,
      stroke: true,
    }
  },
  'Orange and blue': {
    ctxConfig: {
      fillStyle: 'orange',
      strokeStyle: 'blue',
    },
    drawFunc: (e) => ([
      ['rect'], []
    ]),
    drawOptions: {
      fill: true,
      stroke: true,
    }
  }
};

let selectedBrush = brushes.default;


const canvas = new canvasManager.Canvas('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style = {
  border: '1px solid black'
}

ThanksBeToVue.render('#toolbar', c => {
  return c('div', 
    {
      style: {
        padding: '10px',
        margin: '10px 0',
        display: 'flex',
        fontFamily: 'sans-serif'
      }
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
})

canvas.on('mousedown', () => {
  canvas.createPath(selectedBrush)
  Object.entries(canvas.currentPath.ctxConfig).forEach(([key, value]) => {
    canvas.ctx[key] = value;
  });
  
  canvas.on('mousemove', e => {
    canvas.draw(() => ({
      rect: [e.offsetX, e.offsetY, 20, 20],
    }))
  })
  // canvas.on('mousemove', e => {
  //   canvas.draw(path => {
  //     path.rect(e.offsetX, e.offsetY, 20, 20);
  //   })
  // });
});

canvas.on('mouseup', () => {
  canvas.endPath();
  canvas.off('mousemove');
});

