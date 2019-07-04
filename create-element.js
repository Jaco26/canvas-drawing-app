const DEBUG = true

const debugLog = (...args) => DEBUG ? console.log(...args) : null;

const ThanksBeToVue = (function() {

  /**
   * 
   * @typedef Data
   * @property {Object<string, boolean>} class
   * @property {Object<string, string>} style
   * @property {Object<string, string>} attrs
   * @property {Object<string, function(Event|MouseEvent)>} on
   * 
   */

  /**
   * @name createElement
   * @function
   * @param {ElementCreationOptions} tagName 
   * @param {Data | Node[]} data 
   * @param {Node[]} children 
   */
  function createElement(tagName, data, children) {
    /** @type {Data} */
    let _data = null;
    /** @type {Node | Node[]} */
    let _children = null;

    if (Array.isArray(children) && data && typeof data === 'object') {
      _data = data;
      _children = children;
    } else if (Array.isArray(data)) {
      _data = null;
      _children = data;
    } else {
      _children = null;
      _data = data;
    }

    const el = document.createElement(tagName);

    if (_data) {
      if (_data.class) {
        Object.keys(data.class).forEach(key => {
          _data.class[key]
            ? el.classList.add(key)
            : el.classList.remove(key);
        });
      }
      if (_data.style) {
        Object.keys(data.style).forEach(key => {
          el.style[key] = _data.style[key]
        });
      }
      if (_data.attrs) {
        Object.keys(data.attrs).forEach(key => {
          el.setAttribute(key, _data.attrs[key]);
        });
      }
      if (_data.on) {
        Object.keys(data.on).forEach(key => {
          el.addEventListener(key, _data.on[key]);
        });
      }
    }
    
    if (_children) {
      _children.forEach(child => {
        el.append(child);
      }); 
    }
    return el;
  }


  /**
   * 
   * @param {string} parentSelector 
   * @param {function(createElement)} callback 
   */
  function render(parentSelector, callback) {
    const parent = document.querySelector(parentSelector);
    const child = callback(createElement)
    return parent.appendChild(child);
  }

  return { render, createElement };

})();

/** @param {function(createElement)} callback */
function renderCard(callback) {
  return createElement('div',
    {
      style: { padding: '0.5rem' },
    },
    [
      callback(createElement)
    ]
  );
}