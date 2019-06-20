var BRUSH_SELECT = (function() {

  const { brushes } = STORE;
  
  return new Component({
    el: '#brush-select',
    events: {
      'brushes': {
        change(e, ref) {
          const b = brushes.list.find(b => b.name === e.target.value).handler;
          brushes.selectedBrush = b
        },
      },
    },
    template(data, utils) {
      return (`
        <label>Brush:</label>
        ${data.selectedMode}
        <select ref="brushes">
          ${brushes.list.reduce((acc, x) => (
            acc + `<option value="${x.name}">${x.name}</option>`
          ), '')}
        </select>
      `)
    },
  });
})();