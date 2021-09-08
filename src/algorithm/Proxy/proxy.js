let callbacks = new Map() // 记录effect的回调函数
let usedReactivities = [] // 使用到的响应式属性
let reactivities = new Map() // 记录响应式对象

function effect(callback) {
  usedReactivities = []
  callback()
  console.log(usedReactivities)
  for (let reactivity of usedReactivities) {
    if (!callbacks.has(reactivity[0])) {
      callbacks.set(reactivity[0], new Map())
    }
    if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
      callbacks.get(reactivity[0]).set(reactivity[1], [])
    }
    callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
  }
}

function reactive(object) {
  if (reactivities.has(object)) {
    return reactivities.get(object)
  }
  let proxy = new Proxy(object, {
    set(obj, prop, value) {
      obj[prop] = value
      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          for (let callback of callbacks.get(obj).get(prop)) {
            callback()
          }
        }
      }
      return obj[prop]
    },
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop])
      }
      return obj[prop]
    },
  })

  reactivities.set(object, proxy)
}

const object = {
  a: 1,
  b: 2,
}
const po = reactive(object)

effect(() => {
  console.log(po.a, 'effect')
})
