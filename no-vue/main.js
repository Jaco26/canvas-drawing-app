

const { draw, on, off } = initCanvas({ 
  height: 400, 
  width: 400, 
  style: {
    border: '1px solid #999',
    backgroundColor: '#dfdfdf'
  },
});


const defaultBrush = createBrush({
  init() {
    on('mousedown', e => defaultBrush.onMousedown(e));
    on('mouseup', e => defaultBrush.onMouseup(e))
  },
  onMousedown(e) {
    on('mousemove', e => this.onMousemove(e));
  },
  onMousemove(e) {
    draw(ctx => {
      ctx.fillRect(e.offsetX, e.offsetY, 2, 2);
    })
  },
  onMouseup(e) {
    off('mousemove');
  }
});


defaultBrush.init()



