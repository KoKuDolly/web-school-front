import './index.less'
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
    this.root.classList.add('carousel')
    for (let record of this.attributes.src) {
      let child = document.createElement('div')
      child.style.backgroundImage = `url(${record})`
      this.root.appendChild(child)
    }

    this.root.addEventListener('mousedown', () => {
      console.log('mousedown')
      let move = () => {
        console.log('move')
      }
      let up = () => {
        console.log('up')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    /*let currentIndex = 0
    setInterval(() => {
      let children = this.root.children
      let nextIndex = (currentIndex + 1) % children.length
      let current = children[currentIndex]
      let next = children[nextIndex]
      next.style.transition = 'none'
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`
      setTimeout(() => {
        next.style.transition = ''
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
        next.style.transform = `translateX(${-nextIndex * 100}%)`
        currentIndex = nextIndex
      }, 16)
    }, 3000)*/
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
