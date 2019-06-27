

const app = new Vue({
  el: '#app',
  components: {
    TheToolbar,
    TheCanvas,
  },
  data: {
    brushOptions: [
      { text: 'Default', component: DefaultBrush },
      { text: 'Rainbow', component: RainbowBrush },
    ],
    selectedBrush: { text: 'Default', component: DefaultBrush },
  },
  template: `
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <the-toolbar 
          :brushOptions="brushOptions"
          :selectedBrush.sync="selectedBrush"
        ></the-toolbar>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <the-canvas></the-canvas>
      </div>
    </div>
  </div>`
}).$mount();


