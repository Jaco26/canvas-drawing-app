
ThanksBeToVue.render('#toolbar', c => c('div', 
  {
    style: {
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#aa888877',
      display: 'flex',
    } 
  },
  [
    c('select',
      {
        on: { change: e => brushes[e.target.value].init() }
      },
      Object.keys(brushes).map(key => c('option', { attrs: { value: key }}, [key]))
    ),
    c('div', { style: { margin: 'auto' }}, [""]),
    c('button',
      {
        class: { 'mx-1': true },
        on: { click: () => draw(ctx => ctx.clearRect(0, 0, 700, 700)) }
      },
      ['Clear Canvas'],
    ),
    c('a',
      {
        class: { 'mx-1': true },
        attrs: {
          href: getCanvasImage(),
          download: 'myImage.png',
          title: 'Download what you\'ve drawn as a .png image file'
        },
        on: {
          click: function(e) {
            // `this` in this case refers to the <a> element that is created by the render function
            this.href = getCanvasImage()
          }
        }
      },
      ['Download']
    )
  ]
));
