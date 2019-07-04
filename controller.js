

const brushes = {
  default: {
    ctxConfig: {
      fillStyle: '#999',
      strokeStyle: '#333',
    },
    drawFunc: e => (['rect', [e.offsetX, e.offsetY, 30, 30]]),
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
    drawFunc: e => (['rect', [e.offsetX, e.offsetY, 30, 30]]),
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
      {
        func: 'rect',
        args: [
          e.offsetX / 1.5,
          e.offsetY * 1.5,
          5,
          5
        ],
      }
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
    canvas.draw(() => selectedBrush.drawFunc(e))
  });

});

canvas.on('mouseup', () => {
  canvas.endPath();
  canvas.off('mousemove');
});

