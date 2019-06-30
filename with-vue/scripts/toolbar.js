
const TheToolbar = {
  props: {
    brushOptions: Array,
    selectedBrush: Object,
  },
  template: //html
  `<div class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="navbar-text">Hello</div>
      <component :is="selectedBrush.component"></component>
      <select v-model="selectedBrush">
        <option 
          v-for="(opt, i) in brushOptions" 
          :key="i"
          :value="opt"
          :selected="opt.text === selectedBrush.text"
        >
          {{opt.text}}
        </option>
      </select>
  </div>`,
}

// @change="$emit('update:selectedBrush', $event)"