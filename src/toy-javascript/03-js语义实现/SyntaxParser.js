import { scan } from './LexParser.js'
// ll lr
// 终结符 非终结符
// 词法 token   语法 terminal symbol 联系起来
let syntax = {
  Program: [['StatementList', 'EOF']],
  StatementList: [['Statement'], ['StatementList', 'Statement']],
  Statement: [
    ['ExpressionStatement'],
    ['IfStatement'],
    ['VariableDeclaration'],
    ['FunctionDeclaration'],
  ],
  ExpressionStatement: [['Expression', ';']],
  Expression: [['AssignmentExpression']],
  AssignmentExpression: [
    ['LeftHandSideExpression', '=', 'LogicalORExpression'],
    ['LogicalORExpression'],
  ],
  LogicalORExpression: [
    ['LogicalANDExpression'],
    ['LogicalORExpression', '||', 'LogicalANDExpression'],
  ],
  LogicalANDExpression: [
    ['AdditiveExpression'],
    ['LogicalANDExpression', '&&', 'AdditiveExpression'],
  ],
  AdditiveExpression: [
    ['MultiplicativeExpression'],
    ['AdditiveExpression', '+', 'MultiplicativeExpression'],
    ['AdditiveExpression', '-', 'MultiplicativeExpression'],
  ],
  MultiplicativeExpression: [
    ['LeftHandSideExpression'],
    ['MultiplicativeExpression', '*', 'LeftHandSideExpression'],
    ['MultiplicativeExpression', '/', 'LeftHandSideExpression'],
  ],
  LeftHandSideExpression: [['CallExpression'], ['NewExpression']],
  CallExpression: [
    ['MemberExpression', 'Arguments'],
    ['CallExpression', 'Arguments'],
  ], // new a()
  NewExpression: [['MemberExpression'], ['new', 'NewExpression']], // new a
  MemberExpression: [
    ['PrimaryExpression'],
    ['PrimaryExpression', '.', 'Identifier'],
    ['PrimaryExpression', '[', 'Expression', ']'],
  ], // new a.b

  PrimaryExpression: [['(', 'Expression', ')'], ['Literal'], ['Identifier']],
  Literal: [
    ['NumericLiteral'],
    ['StringLiteral'],
    ['BooleanLiteral'],
    ['NullLiteral'],
    ['RegularExpressionLiteral'],
    ['ObjectLiteral'],
    ['ArrayLiteral'],
  ],
  ObjectLiteral: [
    ['{', '}'],
    ['{', 'PropertyList', '}'],
  ],
  PropertyList: [['Property'], ['PropertyList', ',', 'Property']],
  Property: [
    ['StringLiteral', ':', 'AdditiveExpression'],
    ['Identifier', ':', 'AdditiveExpression'],
  ],
  IfStatement: [['if', '(', 'Expression', ')', 'Statement']],
  VariableDeclaration: [['let', 'Identifier', ';']],
  FunctionDeclaration: [
    ['function', 'Identifier', '(', ')', '{', 'StatementList', '}'],
  ],
}

// 第一个接受的终结符
// 展开非终结符的过程 求 closure 广度优先搜索
let hash = {}
function closure(state) {
  hash[JSON.stringify(state)] = state
  let queue = []
  for (let symbol in state) {
    if (symbol.match(/^\$/)) {
      continue
    }
    queue.push(symbol)
  }
  // 展开一层 closure
  while (queue.length) {
    let symbol = queue.shift()
    // console.log(symbol)
    if (syntax[symbol]) {
      for (let rule of syntax[symbol]) {
        if (!state[rule[0]]) {
          queue.push(rule[0])
          // state[rule[0]] = true // 删掉
        }
        let current = state
        for (let part of rule) {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part] // 前进一步
        }
        current.$reduceType = symbol
        current.$reduceLength = rule.length
      }
    }
  }
  // 展开所有层 closure
  for (let symbol in state) {
    if (symbol.match(/^\$/)) {
      continue
    }
    if (!hash[JSON.stringify(state[symbol])]) {
      closure(state[symbol])
    } else {
      state[symbol] = hash[JSON.stringify(state[symbol])]
    }
  }
}

let end = {
  $isEnd: true,
}
let start = {
  Program: end,
}

closure(start)
console.log(start)

function parse(source) {
  let stack = [start]
  let symbolStack = []

  function reduce() {
    let state = stack[stack.length - 1]
    // console.log(state)
    if (state.$reduceType) {
      let children = []
      for (let i = 0; i < state.$reduceLength; i++) {
        stack.pop()
        children.push(symbolStack.pop())
      }
      return {
        type: state.$reduceType,
        children: children.reverse(),
      }
    } else {
      throw new Error('unexpected token')
    }
  }

  function shift(symbol) {
    let state = stack[stack.length - 1]

    if (symbol.type in state) {
      stack.push(state[symbol.type])
      symbolStack.push(symbol)
    } else {
      /* reduce to no terminal symbol */
      // 编译原理里叫 reduce terminal symbol 到 not terminal symbol的过程
      shift(reduce())
      shift(symbol)
    }
  }

  for (let symbol /* terminal symbol */ of scan(source)) {
    shift(symbol)
  }
  // reduce()
  // console.log(reduce())
  let r = reduce()
  console.log(r)
  return r
  // return reduce()
}

class Realm {
  constructor() {
    this.global = new Map()
    this.Object = new Map()
    this.Object.call = function () {}
    this.Object_prototype = new Map()
  }
}

class EnvironmentRecord {
  constructor() {
    this.thisValue
    this.variables = new Map()
    this.outer = null
  }
}

class ExecutionContext {
  constructor() {
    this.lexicalEnvironment = {}
    this.variableEnvironment = this.lexicalEnvironment
    this.realm = {
      global: {},
      Object: {},
      Object_prototype: {},
    }
  }
  // LexicalEnvironment: {a: 1, b: 2}
}

// 7 种基本类型外，运行时存在的类型
class Reference {
  constructor(object, property) {
    this.object = object
    this.property = property
  }
  set(value) {
    this.object[this.property] = value
  }

  get() {
    return this.object[this.property]
  }
}

let evaluator = {
  Program(node) {
    return evaluate(node.children[0])
  },
  StatementList(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      evaluate(node.children[0])
      return evaluate(node.children[1])
    }
  },
  Statement(node) {
    return evaluate(node.children[0])
  },
  VariableDeclaration(node) {
    // console.log('Declare variable', node.children[1])
    let runningEC = ecs[ecs.length - 1]
    return runningEC.variableEnvironment[node.children[1].name]
  },
  ExpressionStatement(node) {
    return evaluate(node.children[0])
  },
  Expression(node) {
    return evaluate(node.children[0])
  },
  AdditiveExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      // TODO
    }
  },
  MultiplicativeExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      // TODO
    }
  },
  PrimaryExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    } else {
      // TODO
    }
  },
  Literal(node) {
    return evaluate(node.children[0])
  },
  NumericLiteral(node) {
    let str = node.value
    let l = str.length
    let value = 0
    let n = 10

    if (str.match(/^0b/)) {
      n = 2
      l -= 2
    } else if (str.match(/^0o/)) {
      n = 8
      l -= 2
    } else if (str.match(/^0x/)) {
      n = 16
      l -= 2
    }

    while (l--) {
      let c = str.charCodeAt(str.length - l - 1)
      if (c >= 'a'.charCodeAt(0)) {
        c = c - 'a'.charCodeAt(0) + 10
      } else if (c >= 'A'.charCodeAt(0)) {
        c = c - 'A'.charCodeAt(0) + 10
      } else if (c >= '0'.charCodeAt(0)) {
        c = c - '0'.charCodeAt(0)
      }
      value = value * n + c
    }
    return Number(node.value)
  },
  StringLiteral(node) {
    // console.log(node)
    let result = []
    for (let i = 1; i < node.value.length - 1; i++) {
      if (node.value[i] === '\\') {
        ++i
        // \u 自增4 \x 自增2
        // 当前没有处理16进制和8进制的转义字符，所以自增是1
        // 自增是为了处理完转义字符后，让循环指针下一次执行走出转义字符的长度范围
        let c = node.value[i]
        let map = {
          '"': '"',
          "'": "'",
          '\\': '\\',
          '\0': String.fromCharCode(0x0000),
          b: String.fromCharCode(0x0008),
          f: String.fromCharCode(0x000c),
          n: String.fromCharCode(0x000a),
          r: String.fromCharCode(0x000d),
          t: String.fromCharCode(0x0009),
          v: String.fromCharCode(0x000b),
        }
        // BMP 字符串的基平面，一共有16个平面 unicode
        if (c in map) {
          // map[c]
          result.push(map[c])
        } else {
          result.push(c)
        }
      } else {
        result.push(node.value[i])
      }
    }
    // console.log(result)
    return result.join('')
  },
  ObjectLiteral(node) {
    if (node.children.length === 2) {
      return {}
    }
    if (node.children.length === 3) {
      let object = new Map()
      this.PropertyList(node.children[1], object)
      // object.prototype
      return object
    }
  },
  PropertyList(node, object) {
    if (node.children.length === 1) {
      this.Property(node.children[0], object)
    } else {
      this.PropertyList(node.children[0], object)
      this.Property(node.children[2], object)
    }
  },
  Property(node, object) {
    let name
    if (node.children[0].type === 'Identifier') {
      name = node.children[0].name
    }
    if (node.children[0].type === 'StringLiteral') {
      name = evaluate(node.children[0])
    }
    object.set(name, {
      value: evaluate(node.children[2]),
      enumerable: true,
      configurable: true,
      writable: true,
    })
  },
  AssignmentExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0])
    }
    let left = evaluate(node.children[0])
    let right = evaluate(node.children[2])
    left.set(right)
  },
  Identifier(node) {
    // 唯一标识符
    let runningEC = ecs[ecs.length - 1] // 运行时取栈顶的运行上下文
    return new Reference(runningEC.lexicalEnvironment, node.name)
    // 通过Reference类型，获取当前环境的指定标识符
    // return runningEC.lexicalEnvironment[node.name] 是草率的做法，只能获取，不能写，例如let a = b，b是可读，a是可写。
  },
  EOF() {
    return null
  },
}

let realm = new Realm()
// stack
let ecs = [new ExecutionContext()]

// 语义分析 evaluate ==> eval ???
function evaluate(node) {
  if (evaluator[node.type]) {
    return evaluator[node.type](node)
  }
}

////////////////////////////////////

// let source = `
//  'a\\nb';
// ` // TODO js 外套了一层js的字符串解析，放在html中就没有js的二重转义了? 如何理解

// let tree = parse(source)
// // console.log(tree)

// evaluate(tree)

// document.evaluate() 是个浏览器实现的一个方法，用于处理 xpath，挂在到window上会有冲突，所以包一个命名空间就好了。

window.js = {
  evaluate,
  parse,
}
