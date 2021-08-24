// setInterval(tick, 16) // 不可控，tick写的不好，会产生积压

// let tick = () => {
//   setTimeout(tick, 16)
// } // 比较安全

// timeline
// let tick = () => {
//   requestAnimationFrame(tick)
//   // cancelAnimationFrame(handler)
// }
import { linear } from './ease'

const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')
export class Timeline {
  constructor() {
    this.state = 'inited'
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }
  // get rate() {}
  // set rate() {}

  start() {
    if (this.state !== 'inited') return
    this.state = 'started'
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      // console.log('tick')
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[START_TIME].get(animation) < startTime) {
          // 动画添加时间比执行早，谁发生的更晚，就减去谁
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        } else {
          // 先前执行过一次动画了，后来又添加了新的动画
          t =
            now -
            this[START_TIME].get(animation) -
            this[PAUSE_TIME] -
            animation.delay
        }

        if (t > animation.duration) {
          this.remove(animation)
          t = animation.duration
        }
        if (t > 0) animation.receive(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
      // setTimeout(this[TICK], 16)
    }
    this[TICK]()
    // setInterval(this[TICK], 16) // 不推荐，浏览器行为，如果tick函数写的不恰当，会产生积压
  }

  pause() {
    if (this.state !== 'started') return
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if (this.state !== 'paused') return
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {
    this.state = 'inited'
    this.pause()
    this[PAUSE_START] = 0
    this[PAUSE_TIME] = 0

    this[ANIMATIONS].clear()
    this[START_TIME].clear()

    this[TICK_HANDLER] = null
  }

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now()
    }
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
  remove(animation) {
    this[ANIMATIONS].delete(animation)
  }
}

export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction,
    template
  ) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.timingFunction = timingFunction || linear
    this.delay = delay
    this.template = template || template
  }

  receive(time) {
    // console.log(time)
    let range = this.endValue - this.startValue
    let progress = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(
      this.startValue + range * progress
    )
  }
}
