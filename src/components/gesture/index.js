const element = document.documentElement
// mouse 事件
element.addEventListener('mousedown', (e) => {
  start(e)
  const mousemove = (e) => {
    move(e)
  }
  const mouseup = (e) => {
    end(e)
    element.removeEventListener('mousemove', mousemove)
    element.removeEventListener('mouseup', mouseup)
  }
  element.addEventListener('mousemove', mousemove)
  element.addEventListener('mouseup', mouseup)
})
// touch 事件 touchcancel
element.addEventListener('touchstart', (e) => {
  for (const touch of e.changedTouches) {
    start(touch)
  }
})

element.addEventListener('touchmove', (e) => {
  for (const touch of e.changedTouches) {
    move(touch)
  }
})

element.addEventListener('touchend', (e) => {
  for (const touch of e.changedTouches) {
    end(touch)
  }
})
// 意外结束
element.addEventListener('touchcancel', (e) => {
  for (const touch of e.changedTouches) {
    cancel(touch)
  }
})

let handler
let startX, startY
let isPan = false
let isTap = true
let isPress = false
// 抽象 兼容 mouse 和 touch 事件
let start = (point) => {
  ;(startX = point.clientX), (startY = point.clientY)

  isTap = true
  isPan = false
  isPress = false

  handler = setTimeout(() => {
    isTap = false
    isPan = false
    isPress = true
    handler = null
    console.log('press')
  }, 500)
}

let move = (point) => {
  let dx = point.clientX - startX,
    dy = point.clientY - startY
  if (!isPan && dx ** 2 + dy ** 2 > 100) {
    isTap = false
    isPan = true
    isPress = false
    console.log('panstart')
    clearTimeout(handler)
  }
  if (isPan) {
    // console.log('pan', dx, dy)
  }
}

let end = (point) => {
  if (isTap) {
    console.log('tap')
    clearTimeout(handler)
  }
  if (isPan) {
    console.log('panend')
  }
  if (isPress) {
    console.log('pressend')
  }
}

let cancel = (point) => {
  clearTimeout(handler)
  //   console.log('cancel', point.clientX, point.clientY)
}
