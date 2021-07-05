class XRegExp {
  constructor(source, flag, root = 'root') {
    this.table = new Map()
    this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag)
    console.log(this.regexp)
  }
  compileRegExp(source, name, start) {
    if (source[name] instanceof RegExp)
      return {
        source: source[name].source,
        length: 0,
      }
    let length = 0
    let regexp = source[name].replace(/\<([^\>\<]+)\>/g, (str, $1) => {
      this.table.set(start + length, $1)
      ++length
      let r = this.compileRegExp(source, $1, start + length)
      length += r.length
      return '(' + r.source + ')'
    })
    return {
      source: regexp,
      length: length,
    }
  }
  exec(string) {
    let r = this.regexp.exec(string)
    // console.log(this.regexp)
    for (let i = 1; i < r.length; i++) {
      if (r[i] !== void 0) {
        r[this.table.get(i - 1)] = r[i]
      }
    }
    return r
  }
  get lastIndex() {
    return this.regexp.lastIndex
  }
  set lastIndex(value) {
    this.regexp.lastIndex = value
  }
}

function* scan(str) {
  let _regexp = new XRegExp(
    {
      InputElement: '<Whitespace>|<LineTerminator>|<Comments>|<Token>',
      Whitespace: / |\t/,
      LineTerminator: /\n/,
      Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
      Token: '<Literal>|<Keywords>|<Identifer>|<Punctuator>',
      Literal:
        '<NumericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>',
      NumericLiteral: /(?:[1-9][0-9]*|0)\.[0-9]*|\.[0-9]+|[0-9]+/,
      BooleanLiteral: /true|false/,
      StringLiteral: /\"(?:[^\"\n]|\\[\s\S])*\"|\'(?:[^\'\n]|\\[\s\S])*\'/,
      NullLiteral: /null/,
      Identifer: /[a-zA-Z_$][a-zA-Z_$0-9]*/,
      Keywords: /if|else|for|function|let/,
      Punctuator: /\+\+|\+|\;|\?|\<|\=|\(|\)|\{|\}|\*|\.|\:|\[|\]|\=\>/,
    },
    'g',
    'InputElement'
  )
  while (_regexp.lastIndex + 1 < str.length) {
    // console.log(_regexp.lastIndex)
    let r = _regexp.exec(str)
    // document.write(r[0])
    // console.log(r, 1)
    // console.log(r)
    // yield r
    if (r.Whitespace) {
    } else if (r.LineTerminator) {
    } else if (r.Comments) {
    } else if (r.NumericLiteral) {
      yield {
        type: 'NumericLiteral',
        value: r[0],
      }
    } else if (r.BooleanLiteral) {
      yield {
        type: 'BooleanLiteral',
        value: r[0],
      }
    } else if (r.StringLiteral) {
      yield {
        type: 'StringLiteral',
        value: r[0],
      }
    } else if (r.NullLiteral) {
      yield {
        type: 'NullLiteral',
        value: null,
      }
    } else if (r.Identifer) {
      yield {
        type: 'Identifer',
        value: r[0],
      }
    } else if (r.Keywords) {
      yield {
        type: r[0],
      }
    } else if (r.Punctuator) {
      yield {
        type: r[0],
      }
    } else {
      throw new Error('unexpected token' + r[0])
    }
    yield {
      type: 'EOF',
    }
  }
}

let source = `
	for (let i = 0; i < 13; i++) {
		for (let j = 0; j < 3; j++) {
			let cell = document.createElement('div')
			cell.classList.add('cell')
			cell.innerText = pattern[i * 3 + j] === 2 ? "x" : pattern[i * 3 + j] === 1 ? 'o' : ''
			cell.addEventListener('click', () => userMove(j, i))
			board.appendChild(cell)
		}
		board.appendChild(document.createElement('br'))
	}
	`

for (let element of scan(source)) {
  console.log(element)
}
