
const TheToolbar = {
  props: {
    brushOptions: Array,
    selectedBrush: Object,
  },
  methods: {
    selectBrush: function(event, other) {
      console.log(event, other)
    },
  },
  template: `
  <div class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="navbar-text">Hello</div>
      <select 
        :value="selectedBrush"
        @input="selectBrush($event)"
      >
        <option 
          v-for="(opt, i) in brushOptions" 
          :key="i"
          :value="opt"
        >
          {{opt.text}}
        </option>
      </select>
  </div>`,
}

// @change="$emit('update:selectedBrush', $event)"