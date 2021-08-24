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

export class Component {
  constructor() {
    // this.root = this.render()
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    // this.root.appendChild(child)
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
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
