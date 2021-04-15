const net = require('net')

class Request {
  constructor(props) {
    this.method = props.method || 'GET'
    this.host = props.host
    this.port = props.port || 80
    this.path = props.path || '/'
    this.body = props.body || {}
    this.headers = props.headers || {}
    if (!this.headers["Content-Type"]) {
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (this.headers['Content-Type'] === 'application/json') {
        this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`.join('&'))
    } else {
        this.headers['Content-Type'] = this.bodyText.length
    }

    send() {
        return new Promise((resolve, reject) => {
            // ...
        })
    }

  }
}

void (async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed',
    },
    body: {
      name: 'winter',
    },
  })

  let response = await request.send()

  console.log(response)
})()
