const http = require('http')

const str = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./index.css" />
		<style>
			div #foo {
				width: 100px;
				height: 20px;
				font-size: 14px;
			}
			div .class1 {
				color: red;
				background: yellow;
				width: 20px;
			}
			#id2 {
				width: 100px;
				height: 50px;
				background: blue;
			}
		</style>
</head>

<body>
    <div>
			<div id="foo" class="class1">
				div1
			</div>
		</div>
		<div id = "id2" class = "class2">d iv2</div>
    <script src="./index.js"></script>
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
