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

    let position = 0 // 比例值
    this.root.addEventListener('mousedown', (event) => {
      let children = this.root.children
      let startX = event.clientX

      let move = (event) => {
        let x = event.clientX - startX
        let width = children[0].offsetWidth // getClientRect
        for (let child of children) {
          child.style.transition = 'none'
          child.style.transform = `translateX(${
            ((position * width + x) / width) * 100
          }%)`
        }
      }
      let up = (event) => {
        let x = event.clientX - startX
        let width = children[0].offsetWidth
        position = position + Math.round(x / width) // 比例
        for (let child of children) {
          child.style.transition = ''
          child.style.transform = `translateX(${position * 100}%)`
        }
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
