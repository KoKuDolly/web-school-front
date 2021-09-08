let callbacks = new Map()
let usedReactivities = []

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
  return new Proxy(object, {
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
      return obj[prop]
    },
  })
}

const object = {
  a: 1,
  b: 2,
}
const po = reactive(object)

effect(() => {
  console.log(po.a, 'effect')
})
