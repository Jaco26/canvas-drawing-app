var BRUSH_SELECT = (function() {

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
         ctx.strokeStyle = '#333'
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
   ];

  return new Component({
    el: '#brush-select',
    data: {
      brushes,
      selectedBrush: brushes[0].handler,
    },
    events: {
      'brushes': {
        change(e, ref, data, methods) {
          const b = data.brushes.find(b => b.name === e.target.value).handler;
          data.selectedBrush = b
        },
      },
    },
    template(data) {
      return (`
        <label>Brush:</label>
        <select ref="brushes">
          ${data.brushes.reduce((acc, x) => (
            acc + `<option value="${x.name}">${x.name}</option>`
          ), '')}
        </select>
      `)
    },
  });
})();