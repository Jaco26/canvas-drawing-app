/** 
 * @typedef {{
 *  name: string, 
 *  handler: function(MouseEvent, CanvasRenderingContext2D): void
 * }} Brush 
 */


let colorIndex = 0;
let outlineIndex = 4;
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

/** @type Brush[] */
const brushes = [
  {
    name: 'default',
    handler(e, ctx) {
      ctx.strokeRect(e.offsetX, e.offsetY, 2, 2);
    }
  },
  { 
    name: 'rainbow',
    handler(e, ctx) {
      ctx.strokeStyle = colors[outlineIndex];
      ctx.fillStyle = colors[colorIndex];
      ctx.rect(e.offsetX - 7, e.offsetY - 7, 15, 15);
      ctx.stroke();

      colorIndex === colors.length - 1
        ? colorIndex = 0
        : colorIndex += 1; 

      outlineIndex === colors.length - 1
        ? outlineIndex = 0
        : outlineIndex += 1; 
    }
  },
]


var controlBar = new Component({
  el: '#control-bar',
  data: {
    brushes,
    selectedBrush: brushes[0].handler,
  },
  events: {
    'brush-select': {
      change(e, ref, data, methods) {
        const b = data.brushes.find(b => b.name === e.target.value).handler;
        data.selectedBrush = b
      },
    },
  },
  template(data) {
    return (`
      <div>
        <label>Brush:</label>
        <select ref="brush-select">
          ${data.brushes.reduce((acc, x) => (
            acc + `<option value="${x.name}">${x.name}</option>`
          ), '')}
        </select>
      </div
    `)
  },
});



var cMain = new Component({
  el: '#main',
  createRef(selector) {
    return new Canvas(selector);
  },
  events: {
    canvas: {
      mousedown(e, canvas, data, methods) {
        canvas.on('mousemove', e => {
          canvas.draw(ctx => {
            controlBar.data.selectedBrush(e, ctx);
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




