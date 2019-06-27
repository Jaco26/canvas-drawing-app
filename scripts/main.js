

const app = new Vue({
  el: '#app',
  components: {
    TheToolbar,
    TheCanvas,
  },
  template: `
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <the-toolbar></the-toolbar>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <the-canvas></the-canvas>
      </div>
    </div>
  </div>`
}).$mount();


