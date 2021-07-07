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
  Expression: [['AdditiveExpression']],
  AdditiveExpression: [
    ['MultiplicativeExpression'],
    ['AdditiveExpression', '+', 'MultiplicativeExpression'],
    ['AdditiveExpression', '-', 'MultiplicativeExpression'],
  ],
  MultiplicativeExpression: [
    ['PrimaryExpression'],
    ['MultiplicativeExpression', '*', 'PrimaryExpression'],
    ['MultiplicativeExpression', '/', 'PrimaryExpression'],
  ],
  PrimaryExpression: [['(', 'Expression', ')'], ['Literal'], ['Identifier']],
  Literal: [
    ['Number'],
    ['String'],
    ['Boolean'],
    ['Null'],
    ['RegularExpression'],
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
      return
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
      return
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

function parse(source) {
  let stack = [start]
  let symbolStack = []

  function reduce() {
    let state = stack[stack.length - 1]
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
    // console.log(symbol)
    shift(symbol)
  }
  // reduce()
  // console.log(reduce())
  return reduce()
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
    // ['ExpressionStatement'],
    // ['IfStatement'],
    // ['VariableDeclaration'],
    // ['FunctionDeclaration'],
    return evaluate(node.children[0])
  },
  VariableDeclaration(node) {
    console.log('Declare variable', node.children[1])
  },
  EOF() {
    return null
  },
}
function evaluate(node) {
  if (evaluator[node.type]) {
    return evaluator[node.type](node)
  }
}

////////////////////////////////////

let source = `
 let a;
`

let tree = parse(source)
// console.log(tree)

evaluate(tree)
