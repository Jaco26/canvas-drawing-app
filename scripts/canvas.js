
const TheCanvas = {
  data: function() {
    return {
      /** @type {CanvasRenderingContext2D?} */
      ctx: null,
      mouseIsDown: false,
    }
  },
  methods: {
    /** @param {function(CanvasRenderingContext2D)} callback */
    draw: function(callback) {
      this.ctx.beginPath();
      callback(this.ctx);
      this.ctx.closePath();
    },
    /** @param {MouseEvent} e */
    onMouseMove: function(e) {
      this.draw(ctx => {
        ctx.fillRect(e.offsetX, e.offsetY, 2, 2);
      });
    },
  },
  mounted: function() {
    /** @type {HTMLCanvasElement} */
    const canvas = this.$refs.theCanvas;
    canvas.width = 600;
    canvas.height = 600;
    this.ctx = canvas.getContext('2d');
  },
  template: `
  <canvas
    ref="theCanvas"
    id="the-canvas"
    @mousedown="mouseIsDown = true"
    @mouseup="mouseIsDown = false"
    v-on="mouseIsDown ? {mousemove: onMouseMove} : {}"
  ></canvas>`
}