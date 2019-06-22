var BRUSH_SELECT = (function() {

  return new Component({
    el: '#brush-select',
    store: STORE,
    events: {
      'brushes': {
        change(e, ref, data) {
          const b = STORE.brushes.list.find(b => b.name === e.target.value).handler;
          STORE.brushes.selectedBrush = b
        },
      },
    },
    template(data, { temFor }) {
      return (`
        <label>Brush:</label>
        ${STORE.modeSelect.selectedMode}
        <select ref="brushes">
          ${temFor(STORE.brushes.list, x => (
            x.handler === STORE.brushes.selectedBrush
              ? `<option value="${x.name}" selected>${x.name}</option>`
              : `<option value="${x.name}">${x.name}</option>`
          ))}
        </select>
      `)
    },
  });
})();
