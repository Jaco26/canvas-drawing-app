const STORE = (function() {


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
  const brushList = [
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
    data: {
      brushes: {
        list: brushList,
        selectedBrush: brushList[0].handler
      },
      modeSelect: {
        modes: ['dot', 'bezier', 'line', 'path2d'],
        allowedModeIndexes: [0, 2],
      }
    }
  }).data;

})();