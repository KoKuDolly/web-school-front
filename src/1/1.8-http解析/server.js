const http = require('http')

const server = http.createServer((request, response) => {
  let body = []
  console.log(request)
  request
    .on('error', (err) => {
      // console.log(err)
      console.error(err)
    })
    .on('data', (chunk) => {
      // console.log(chunk.toString())
      body.push(chunk.toString())
    })
    .on('end', () => {
      // body = Buffer.concat(body).toString()
      body = Buffer.concat([Buffer.from(body.toString())]).toString()
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end(' Hello World\n')
    })
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(8088)

console.log('server started')
