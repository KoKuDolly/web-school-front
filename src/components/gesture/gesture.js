export class Listener {
  constructor(element, recognizer) {
    let isListeningMouse = false
    let contexts = new Map()
    // mouse 事件
    element.addEventListener('mousedown', (e) => {
      // e.button 按的是哪个键  左键 0， 中键 1， 右键 2，前进 3，后退 4
      const context = Object.create(null)
      contexts.set('mouse' + (1 << e.button), context)

      recognizer.start(e, context)

      const mousemove = (e) => {
        // e.buttons // 掩码
        let button = 1
        while (button <= e.buttons) {
          if (button & e.buttons) {
            //   order of buttons & button property is not same
            let key
            if (button === 2) {
              key = 4
            } else if (button === 4) {
              key = 2
            } else {
              key = button
            }
            const context = contexts.get('mouse' + key)
            recognizer.move(e, context)
          }

          button = button << 1
        }
      }
      const mouseup = (e) => {
        const context = contexts.get('mouse' + (1 << e.button))
        recognizer.end(e, context)
        contexts.delete('mouse' + (1 << e.button))

        if (e.buttons === 0) {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          isListeningMouse = false
        }
      }

      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
        isListeningMouse = true
      }
    })

    // touch 事件 touchcancel

    element.addEventListener('touchstart', (e) => {
      for (const touch of e.changedTouches) {
        let context = Object.create(null)
        contexts.set(touch.identifier, context)
        recognizer.start(touch, context)
      }
    })
    element.addEventListener('touchmove', (e) => {
      for (const touch of e.changedTouches) {
        const context = contexts.get(touch.identifier)
        recognizer.move(touch, context)
      }
    })

    element.addEventListener('touchend', (e) => {
      for (const touch of e.changedTouches) {
        const context = contexts.get(touch.identifier)
        recognizer.end(touch, context)
        contexts.delete(touch.identifier)
      }
    })
    // 意外结束
    element.addEventListener('touchcancel', (e) => {
      for (const touch of e.changedTouches) {
        const context = contexts.get(touch.identifier)
        recognizer.cancel(touch, context)
        contexts.delete(touch.identifier)
      }
    })
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }

  start(point, context) {
    context.startX = point.clientX
    context.startY = point.clientY

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ]

    context.isTap = true
    context.isPan = false
    context.isPress = false
    // 放一个延时器，在时间到之前清除的话，不会触发
    context.handler = setTimeout(() => {
      context.isTap = false
      context.isPan = false
      context.isPress = true
      context.handler = null
      this.dispatcher.dispatch('press', {})
    }, 500)
  }

  move(point, context) {
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false
      context.isPan = true
      context.isPress = false
      context.isVertical = Math.abs(dx) < Math.abs(dy)
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      })
      clearTimeout(context.handler)
    }
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      })
    }
    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    )
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    })
  }

  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap')
      clearTimeout(context.handler)
    }

    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {})
    }
    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    )
    let v, d
    if (context.points.length === 0) {
      v = 0
    } else {
      d = Math.sqrt(
        (point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y) ** 2
      )
      v = d / (Date.now() - context.points[0].t)
    }

    if (v > 1.5) {
      context.isFlick = true
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      })
    } else {
      context.isFlick = false
    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      })
    }
  }

  cancel(point, context) {
    clearTimeout(context.handler)
    this.dispatcher.dispatch('cancel', {})
  }
}

export class Dispatcher {
  constructor(element) {
    this.element = element
  }
  dispatch(type, properties) {
    let event = new Event(type) // 新建一个自定义事件，继承自 Event 对象
    for (let name in properties) {
      event[name] = properties[name]
    }
    this.element.dispatchEvent(event) // 触发事件
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)))
}
