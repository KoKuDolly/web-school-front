import { Component, createElement } from './framework'
// 用构造函数模拟dom元素
class Carousel extends Component {
  constructor() {
    super()
    this.attributes = Object.create(null)
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  render() {
    this.root = document.createElement('div')
    for (let record of this.attributes.src) {
      let child = document.createElement('img')
      child.src = record
      this.root.appendChild(child)
    }
    return this.root
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}

let images = [
  require('../images/05.webp'),
  require('../images/07.webp'),
  require('../images/08.webp'),
  require('../images/09.webp'),
]

let a = <Carousel src={images} />

a.mountTo(document.body)
