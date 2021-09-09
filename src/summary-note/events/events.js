var events = require('events')
var eventEmitter = new events.EventEmitter()
eventEmitter.on('say', function (name) {
  console.log(name)
})

eventEmitter.on('say', function (name) {
  console.log(name)
})

eventEmitter.emit('say', 'jiajun')
eventEmitter.emit('say', 'koku')
