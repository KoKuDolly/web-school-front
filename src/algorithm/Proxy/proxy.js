let callbacks = []
let usedReactivities = []

function effect(callback) {
  // callbacks.push(callback)
  usedReactivities = []
  callback()
  console.log(usedReactivities)
}

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, value) {
      obj[prop] = value
      for (let callback of callbacks) {
        callback()
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
