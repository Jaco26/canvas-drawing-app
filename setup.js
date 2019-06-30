
const { draw, on, off, createBrush } = initCanvas({ 
  height: 700, 
  width: 700, 
  style: {
    border: '1px solid #999',
    backgroundColor: '#dfdfdf'
  },
});


const brushes = {
  default: createBrush({
    ...defaultConfig,
    onMousemove(e) {
      draw(ctx => {
        ctx.fillStyle = '#333'
        ctx.fillRect(e.offsetX, e.offsetY, 5, 5)
      })
    },
  }),

  mirror: createBrush({
    ...defaultConfig,
    onMousemove(e) {
      draw(ctx => {
        ctx.fillStyle = '#333'
        ctx.fillRect(e.offsetY, e.offsetX, 5, 5)
        ctx.fillRect(e.offsetX, e.offsetY, 5, 5)
      })
    }
  }),

  rainbow: createBrush({
    ...defaultConfig,
    data: {
      colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
      colorI: 0,
      skipCycle: 0,
      incrSkip() {
        if (this.skipCycle + 1 < 3) this.skipCycle++;
        else this.skipCycle = 0;
      }
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
    }
  }),
};

brushes.default.init();