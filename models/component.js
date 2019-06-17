let target = null
let refCounter = 1

function watcher(cb) {
  target = cb;
  target()
  target = null
}

class Dep {
  constructor() {
    this.subscribers = [];
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub());
  }
}


class Component {
  constructor({ el, template, data, events, methods, createRef }) {
    this.el = document.querySelector(el);
    this.data = this.wrapData(data);
    this.template = template;
    this.events = events;
    this.methods = this.wrapMethods(methods);
    this.refs = {}
    this.createRef = createRef
    this.render()
  }

  wrapMethods(methods) {
    if (methods) {
      return Object.keys(methods).reduce((acc, name) => {
        acc[name] = methods[name].bind(this);
        return acc;
      }, {});
    }
    return {};
  }

  wrapData(d) {
    const accumulator = {}
    if (d) {
      function inner(accum, data) {
        Object.keys(data).forEach(key => {
          let innerValue = data[key];
          
          if (innerValue && !Array.isArray(innerValue) && typeof innerValue === 'object') {
            accum[key] = {}
            inner(accum[key], innerValue);  
          } else if (innerValue) {
            const dep = new Dep();
            Object.defineProperty(accum, key, {
              get: () => {
                dep.depend();
                return innerValue;
              },
              set: newVal => {
                innerValue = newVal;
                dep.notify();
              }
            })
          }
        })
      }
      inner(accumulator, d);
    }
    return accumulator;
  }

  compileTemplate(tem) {
    const refRe = /<[\w\s]*(ref="([\w-]*)").*>/g
    const refTags = tem.match(refRe);
    if (refTags) {
      refTags.forEach(tag => {
        const refAttr = tag.match(/ref="([\w-]*)"/);
        this.refs[refAttr[1]] = null;
  
        let newTag = tag.replace(refAttr[0], `data-ref="${refAttr[1]}"`)
  
        tem = tem.replace(tag, newTag)
      })
    }
    return tem
  }

  applyEventListeners() {
    Object.keys(this.events).forEach(refName => {

      this.refs[refName] = this.createRef
        ? this.createRef(`[data-ref="${refName}"]`)
        : new El(`[data-ref="${refName}"]`);

      Object.keys(this.events[refName]).forEach(evt => {
        this.refs[refName].on(evt, e => {
          this.events[refName][evt](e, this.refs[refName], this.data, this.methods)
        })
      })
    })
  }

  render() {
    if (this.template) {
      watcher(() => {
        const templateStr = this.compileTemplate(this.template(this.data))
        this.el.innerHTML = templateStr;
        
      })
      this.applyEventListeners()
    }
  }

}



















// const _computed = {
//   description() {
//     return c.data.name + ' is ' + c.data.age + ' years old.';
//   }
// }

// const computed = Object.keys(_computed).reduce((acc, key) => {
//   watcher(() => {
//     acc[key] = _computed[key]();
//   })
//   return acc;
// }, {});


