import './carousel.less'
import { Component, STATE, ATTRIBUTES } from '@/libs/framework'
import { enableGesture } from '@/components/gesture/gesture'
import { Timeline, Animation } from '@/components/animation/animation'
import { ease } from '@/components/animation/ease'

export { STATE, ATTRIBUTES } from '@/libs/framework'
// 用构造函数模拟dom元素
export class Carousel extends Component {
  constructor() {
    super()
  }
  render() {
    // TODO 为什么这里获取不到 getClientRects()
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (let record of this[ATTRIBUTES].src) {
      let child = document.createElement('div')
      child.style.backgroundImage = `url(${record.img})`
      this.root.appendChild(child)
    }

    enableGesture(this.root)

    const timeline = new Timeline()
    timeline.start()

    let children = this.root.children
    let width = 200 // getClientRect

    this[STATE].position = 0

    let t = 0
    let ax = 0
    let handler = null

    this.root.addEventListener('start', (event) => {
      clearInterval(handler)
      timeline.pause()
      let progress = (Date.now() - t) / 1500 // (当前事件触发时间 - 当下图片定时轮播开始时间) / 一张切换的过渡时间
      ax = ease(progress) * width - width // 这里为什么要 - width
    })

    this.root.addEventListener('tap', (event) => {
      this.triggerEvent('click', {
        position: this[STATE].position,
        data: this[ATTRIBUTES].src[this[STATE].position],
      })
    })

    this.root.addEventListener('pan', (event) => {
      let x = event.clientX - event.startX - ax
      let current = this[STATE].position - (x - (x % width)) / width // 移动的时候，取整数倍，不四舍五入

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset
        pos = ((pos % children.length) + children.length) % children.length
        children[pos].style.transition = 'none'
        children[pos].style.transform = `translateX(${
          (-pos + offset) * 100 + (x % width)
        }%)`
      }
    })

    this.root.addEventListener('end', (event) => {
      timeline.reset()
      timeline.start()

      handler = setInterval(nextPicture, 3000)

      let x = event.clientX - event.startX - ax
      let current = this[STATE].position - (x - (x % width)) / width // 移动的时候，取整数倍，不四舍五入

      let direction = Math.round((x % width) / width)
      // 正负数学上是符号，大小。物理上是方向，大小按绝对值来算
      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % width) / width) // 负数，向上取整， -10.9 ceil 后 为 -10
        } else {
          direction = Math.floor((x % width) / width) // 正数，向下取整
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset
        pos = ((pos % children.length) + children.length) % children.length
        children[pos].style.transition = 'none'
        timeline.add(
          new Animation(
            children[pos].style,
            'transform',
            (-pos + offset) * width + (x % width),
            (-pos + offset) * width + direction * width,
            1500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        )
      }

      this[STATE].position =
        this[STATE].position - (x - (x % width)) / width - direction
      this[STATE].position =
        ((this[STATE].position % children.length) + children.length) %
        children.length

      this.triggerEvent('change', { position: this[STATE].position })
    })

    const nextPicture = () => {
      let children = this.root.children
      let nextPosition = (this[STATE].position + 1) % children.length
      let current = children[this[STATE].position]
      let next = children[nextPosition]

      t = Date.now()

      timeline.add(
        new Animation(
          current.style,
          'transform',
          -this[STATE].position * width,
          -width - this[STATE].position * width,
          1500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      )

      timeline.add(
        new Animation(
          next.style,
          'transform',
          width - nextPosition * width,
          -nextPosition * width,
          1500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      )

      this[STATE].position = nextPosition
      this.triggerEvent('change', { position: this[STATE].position })
    }

    handler = setInterval(nextPicture, 3000)

    /*this.root.addEventListener('mousedown', (event) => {
      let children = this.root.children
      let startX = event.clientX
      let width = children[0].offsetWidth // getClientRect

      let move = (event) => {
        let x = event.clientX - startX
        let current = position - (x - (x % width)) / width

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + children.length) % children.length // 对称，不用Math.abs()，负数的转换
          children[pos].style.transition = 'none'
          children[pos].style.transform = `translateX(${
            (-pos + offset) * 100 + (x % width)
          }%)`
        }
      }
      let up = (event) => {
        let x = event.clientX - startX
        position = position - Math.round(x / width)
        for (let offset of [
          0,
          Math.sign(x - Math.round(x / width) - (width / 2) * Math.sign(x)),
        ]) {
          let pos = position + offset
          pos = (pos + children.length) % children.length // 对称，不用Math.abs()，负数的转换

          children[pos].style.transition = ''
          children[pos].style.transform = `translateX(${
            (-pos + offset) * 100
          }%)`
        }
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    let currentIndex = 0
    setInterval(() => {
      let children = this.root.children
      let nextPosition = (currentIndex + 1) % children.length
      let current = children[currentIndex]
      let next = children[nextPosition]
      next.style.transition = 'none'
      next.style.transform = `translateX(${100 - nextPosition * 100}%)`
      setTimeout(() => {
        next.style.transition = ''
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
        next.style.transform = `translateX(${-nextPosition * 100}%)`
        currentIndex = nextPosition
      }, 16)
    }, 3000)*/
    return this.root
  }
}
