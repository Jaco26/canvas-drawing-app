var MODE_SELECT = (function() {



  return new Component({
    el: '#mode-select',
    events: {
      modes: {
        change(e, ref, data) {
          STORE.modeSelect.selectedMode = e.target.value
        }
      }
    },
    template(data, { temFor }) {
      const { modes, allowedModeIndexes } = STORE.modeSelect
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