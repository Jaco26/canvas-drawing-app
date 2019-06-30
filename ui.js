
ThanksBeToVue.render('#toolbar', c => c('div', 
  {
    style: {
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#aa888877'
    } 
  },
  [
    c('select',
      {
        on: { change: e => brushes[e.target.value].init() }
      },
      Object.keys(brushes).map(key => c('option', { attrs: { value: key }}, [key]))
    ),
    c('button',
      {
        on: { click: () => draw(ctx => ctx.clearRect(0, 0, 700, 700)) }
      },
      ['Clear'],
    ),
  ]
));
