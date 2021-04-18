const http = require('http')

const server = http.createServer((request, response) => {
  let body = []
  console.log(request, 5)
  request
    .on('error', (err) => {
      // console.error(err, 8)
    })
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', () => {
      body = Buffer.concat(body)
      // .toString()
      // body = Buffer.concat([Buffer.from(body.toString())]).toString()
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end(' Hello World\n')
    })
})

// server.on('clientError', (err, socket) => {
//   console.log('clientError')
//   socket.end('HTTP/1.1 400 Bad Request \r\n\r\n')
// })

server.listen(8088)

console.log('server started')
