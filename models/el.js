class El {
  constructor(selector) {
    /** @type {HTMLElement} */
    this.el = document.querySelector(selector);
    this.eventListeners = {};
  }

  get textContent() { return this.el.textContent }
  set textContent(val) { this.el.textContent = val }

  /**
   * 
   * @param {string} type an Event type
   * @param {function(Event | MouseEvent, El)} listener 
   */
  on(type, listener) {
    if (this.eventListeners[type]) {
      this.off(type)
    }
    this.eventListeners[type] = function(e) {
      listener(e, this);
    }
    this.el.addEventListener(type, this.eventListeners[type]);
  }

  off(type) {
    this.el.removeEventListener(type, this.eventListeners[type])
    this.eventListeners[type] = null
  }
}