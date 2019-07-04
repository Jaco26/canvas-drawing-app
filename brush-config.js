
const brushes = {
  default: {
    ctxConfig: {
      fillStyle: '#999',
      strokeStyle: '#333',
    },
    drawFunc: e => (['rect', [e.offsetX, e.offsetY, 30, 30]]),
    drawOptions: {
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
      { func: 'rect', args: [e.offsetX / 1.5, e.offsetY * 1.5, 5, 5] }
    ]),
    drawOptions: {
      fill: true,
      stroke: true,
    }
  }
};