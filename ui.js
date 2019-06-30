
ThanksBeToVue.render('#toolbar', c => c('select', 
  {
    on: {
      change(e) {
        brushes[e.target.value].init()
      }
    }
  },
  Object.keys(brushes).map(key => c('option', { attrs: { value: key }}, [key]))
));

ThanksBeToVue.render('#toolbar', c => c('button', { on: { click: () => draw(ctx => ctx.clearRect(0, 0, 700, 700))} }, ['Clear']))