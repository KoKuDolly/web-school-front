const reactive = (object) => {
  return new Proxy(object, {
    set(obj, prop, value) {
      obj[prop] = value
      console.log(obj, prop, value)
      return obj[prop]
    },
    get(obj, prop) {
      console.log(obj, prop)
      return obj[prop]
    },
  })
}

export { reactive }
