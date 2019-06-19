var MODE_SELECT = (function() {

  function temFor(items, temStrFn) {
    return items.reduce((acc, x, i) => (acc + temStrFn(x, i)), '')
  }

  const modes = ['dot', 'bezier', 'line', 'path2d']

  return new Component({
    el: '#mode-select',
    data: {
      modes,
      allowedModeIndexes: [0],
      selectedMode: modes[0],
    },
    events: {
      modes: {
        change(e, ref, data) {
          data.selectedMode = e.target.value
        }
      }
    },
    template({ modes, allowedModeIndexes }) {
      return (`
        <label>Mode</label>
        <select ref="modes">
          ${temFor(modes, (x, i) => (
            allowedModeIndexes.includes(i)
              ? `<option value="${x}">${x}</option>`
              : `<option disabled value="${x}">${x}</option>`
          ))}
        </select>
      `)
    }
  })

})();