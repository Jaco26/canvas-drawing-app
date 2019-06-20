
var CANVAS_MAIN = (function() {



  return new Component({
    el: '#main',
    createRef(selector) {
      return new Canvas(selector);
    },
    events: {
      canvas: {
        mousedown(e, canvas, data, methods) {
          canvas.on('mousemove', e => {
            canvas.draw(ctx => {
              const paint = STORE.brushes.selectedBrush(e, ctx);
            })
          })
        },
        mouseup(e, canvas) {
          canvas.off('mousemove')
        }
      }
    },
    template(data) {
      return '<canvas ref="canvas"></canvas>'
    },
  })

})();

