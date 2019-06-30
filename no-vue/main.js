

const { draw, on, off } = initCanvas({ 
  height: 700, 
  width: 1400, 
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



const orangeRectangles = createBrush({
  init() {
    on('mousedown', e => this.onMousedown(e));
    on('mouseup', e => this.onMouseup(e))
  },
  onMousedown(e) {
    on('mousemove', e => this.onMousemove(e));
  },
  onMousemove(e) {
    draw(ctx => {
      ctx.strokeStyle = 'orange';
      ctx.rect(e.offsetX, e.offsetY, 20, 6);
      ctx.stroke()
    })
  },
  onMouseup(e) {
    off('mousemove');
  }
});


const rainbowBrush = createBrush({
  data: {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
    colorI: 0,
    skipCycle: 0,
    incrSkip() {
      if (this.skipCycle + 1 < 3) this.skipCycle++;
      else this.skipCycle = 0;
    }
  },
  init() {
    on('mousedown', e => this.onMousedown(e));
    on('mouseup', e => this.onMouseup(e));
  },
  onMousemove(e) {
    this.data.incrSkip();
    if (this.data.skipCycle === 1) {
      const { colors, colorI } = this.data;
      const color = colors[colorI];
      draw(ctx => {
        ctx.fillStyle = color;
        ctx.fillRect(e.offsetX, e.offsetY, 20, 10)
      });
      if (this.data.colorI < this.data.colors.length - 1)
        this.data.colorI += 1;
      else 
        this.data.colorI = 0;
    }
  },
  onMousedown() {
    on('mousemove', e => this.onMousemove(e));
  },
  onMouseup() {
    off('mousemove');
  }
});

rainbowBrush.init();

// defaultBrush.init();
// // orangeSquares.init()

// setTimeout(() => {
//   orangeSquares.init();
// }, 5000)


