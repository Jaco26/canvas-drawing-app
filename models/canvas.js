
class Canvas extends El {
  constructor(selector, size = 400, color = '#999') {
    super(selector);
    const self = this;

    this.el.width = size
    this.el.height = size
    this.el.style.border = `solid 1px ${color}`
    this.ctx = this.el.getContext('2d')
    
  }

  get width() {
    return this.el.width
  }
  set width(val) {
    this.el.width = val;
  }

  get height() {
    return this.el.height
  }
  set height(val) {
    this.el.height = val;
  }

  get color() {
    return this.el.style.backgroundColor
  }
  set color(val) {
    this.el.style.backgroundColor = val;
  }

  // /**
  //  * 
  //  * @param {{
  //  *  name: string,
  //  *  handler: function(MouseEvent, CanvasRenderingContext2D)
  //  * }} brush 
  //  */
  // addBrush(brush) {
  //   this.brushes[brush.name] = evt => this.draw(ctx => brush.handler(evt, ctx))
  // }

  /**
   * @param {function(CanvasRenderingContext2D)} cb 
   */
  draw(cb) {
    this.ctx.beginPath()
    cb(this.ctx)
    this.ctx.closePath()
  }

  
}
