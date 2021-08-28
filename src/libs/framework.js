export function createElement(type, attributes, ...children) {
  let element
  if (typeof type === 'string') {
    element = new ElementWrrapper(type)
  } else {
    element = new type()
  }

  for (let name in attributes) {
    element.setAttribute(name, attributes[name])
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextWrrapper(child)
    }
    element.appendChild(child)
  }
  return element
}

export const STATE = Symbol('state')
export const ATTRIBUTES = Symbol('attributes')

export class Component {
  constructor() {
    // this.root = this.render()
    this[ATTRIBUTES] = Object.create(null)
    this[STATE] = Object.create(null)
  }
  setAttribute(name, value) {
    // this.root.setAttribute(name, value)
    this[ATTRIBUTES][name] = value
  }
  appendChild(child) {
    // this.root.appendChild(child)
    child.mountTo(this.root)
  }
  mountTo(parent) {
    if (!this.root) this.render()
    parent.appendChild(this.root)
  }
  triggerEvent(type, args) {
    this[ATTRIBUTES]['on' + type.replace(/^[\s\S]/, (s) => s.toUpperCase())](
      new CustomEvent(type, { detail: args })
    )
  }
}

class ElementWrrapper extends Component {
  constructor(type) {
    super()
    this.root = document.createElement(type)
  }
}

class TextWrrapper extends Component {
  constructor(content) {
    super()
    this.root = document.createTextNode(content)
  }
}
