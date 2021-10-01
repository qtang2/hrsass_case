export const imagerror = {
  inserted(dom, options) {
    // dom is the ele with current directive, options is some configuration
    // here dom is img ele
    dom.src = dom.src || options.value
    // when img has address but address is not available anymore then onerror function will be triggered
    dom.onerror = () => {
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
    dom.onerror = () => {
      dom.src = options.value
    }
  }
}
