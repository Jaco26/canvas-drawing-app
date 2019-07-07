const { createApp, createBrush } = DrawingApp;

const ctxOptions = {
  fill: false,
  stroke: true,
  strokeStyle: 'orange',
  fillStyle: 'blue',
}

const brushes = {
  line: createBrush({
    onMousedown({ evt, ctx, currentPath }) {
      ctx.beginPath();
      ctx.moveTo(evt.offsetX, evt.offsetY);
    },
    onMousemove({ evt, ctx, currentPath }) {
      ctx.lineTo(evt.offsetX, evt.offsetY);
    },
    onMouseup({ evt, ctx, currentPath }) {
      ctx.closePath();
    }
  }),
  rect: createBrush({
    onMousemove({ evt, ctx }) {
      ctx.beginPath();
      ctx.rect(evt.offsetX, evt.offsetY, 10, 10);
      ctx.closePath();
    },
  }),
  arc: createBrush({
    onMousemove({ evt, ctx }) {
      ctx.beginPath()
      ctx.arc(evt.offsetX, evt.offsetY, 10, 0, Math.PI * 2);
      ctx.closePath();
    }
  }),
}

const app = createApp({
  selector: '#canvas',
  width: 700,
  height: 700,
  ctxOptions,
});

app.setBrush(brushes.arc)


