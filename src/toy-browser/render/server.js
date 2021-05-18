const http = require('http')

const str = `<!DOCTYPE html>
<html lang="en">

<head>
		<style>
      .flex {
				width: 500px;
				height: 300px;
        display: flex;
				background-color: rgba(255, 255, 255, 1);
      }
      .flex img {
        flex: 1;
      }
			body div #myid {
				width: 100px;
				height: 100px;
				background: rgb(255, 0, 0, 0.5);
			}
			body div img {
				width: 30px;
				height: 30px;
				background: rgb(0, 0, 255, 0.5);
			}
		</style>
</head>

<body>
    <div class="flex">
			<img id="myid" />
			<img class="c1"/>
		</div>
</body>

</html>`

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
      response.end(str)
    })
})

// server.on('clientError', (err, socket) => {
//   console.log('clientError')
//   socket.end('HTTP/1.1 400 Bad Request \r\n\r\n')
// })

server.listen(8088)

console.log('server started')
