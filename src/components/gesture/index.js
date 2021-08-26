const element = document.documentElement
let contexts = new Map() // 存储 mouse 事件 的多个按键， touch 事件的多个触点
let isListeningMouse = false
// mouse 事件
element.addEventListener('mousedown', (e) => {
  //   console.log(e.button) // 按的是哪个键  左键 0， 中键 1， 右键 2，前进 3，后退 4
  const context = Object.create(null)
  contexts.set('mouse' + (1 << e.button), context)

  start(e, context)

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
        // console.log('move', button, e.buttons)
        const context = contexts.get('mouse' + key)
        move(e, context)
      }

      button = button << 1
    }
  }
  const mouseup = (e) => {
    const context = contexts.get('mouse' + (1 << e.button))
    end(e, context)
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
    start(touch, context)
  }
})

element.addEventListener('touchmove', (e) => {
  for (const touch of e.changedTouches) {
    const context = contexts.get(touch.identifier)
    move(touch, context)
  }
})

element.addEventListener('touchend', (e) => {
  for (const touch of e.changedTouches) {
    const context = contexts.get(touch.identifier)
    end(touch, context)
    contexts.delete(touch.identifier)
  }
})
// 意外结束
element.addEventListener('touchcancel', (e) => {
  for (const touch of e.changedTouches) {
    const context = contexts.get(touch.identifier)
    cancel(touch, context)
    contexts.delete(touch.identifier)
  }
})

// 抽象 兼容 mouse 和 touch 事件
let start = (point, context) => {
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

  context.handler = setTimeout(() => {
    context.isTap = false
    context.isPan = false
    context.isPress = true
    context.handler = null
    console.log('press')
  }, 500)
}

let move = (point, context) => {
  let dx = point.clientX - context.startX,
    dy = point.clientY - context.startY
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false
    context.isPan = true
    context.isPress = false
    console.log('panstart')
    clearTimeout(context.handler)
  }
  if (context.isPan) {
    console.log('pan', dx, dy)
  }
  context.points = context.points.filter((point) => Date.now() - point.t < 500)
  context.points.push({
    t: Date.now(),
    x: point.clientX,
    y: point.clientY,
  })
}

let end = (point, context) => {
  if (context.isTap) {
    console.log('tap')
    dispatch('tap')
    clearTimeout(context.handler)
  }
  if (context.isPan) {
    console.log('panend')
  }
  if (context.isPress) {
    console.log('pressend')
  }
  context.points = context.points.filter((point) => Date.now() - point.t < 500)
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
  //   console.log(v, d)
  if (v > 1.5) {
    console.log('flick')
    context.isFlick = true
  } else {
    context.isFlick = false
  }
}

let cancel = (point, context) => {
  clearTimeout(context.handler)
  //   console.log('cancel', point.clientX, point.clientY)
}

// 派发事件
// properties context point
function dispatch(type, properties) {
  let event = new Event(type) // 新建一个自定义事件，继承自 Event 对象
  for (let name in properties) {
    event[name] = properties[name]
  }
  element.dispatchEvent(event) // 触发事件
}
