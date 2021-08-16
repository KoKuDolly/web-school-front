function createElement(type, attributes, ...children) {
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

class ElementWrrapper {
  constructor(type) {
    this.root = document.createElement(type)
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

class TextWrrapper {
  constructor(type) {
    this.root = document.createTextNode(type)
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

// 用构造函数模拟dom元素
class Div {
  constructor() {
    this.root = document.createElement('div')
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    // this.root.appendChild(child)
    console.log(child, this.root)
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

let a = (
  <Div id="a">
    <span>a</span>
    <span>b</span>
    <span>c</span>
  </Div>
)

// document.body.appendChild(a)
// 反向操作
a.mountTo(document.body)
