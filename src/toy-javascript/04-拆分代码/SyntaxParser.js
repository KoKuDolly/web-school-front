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
    ['WhileStatement'],
    ['VariableDeclaration'],
    ['FunctionDeclaration'],
    ['Block'],
    ['BreakStatement'],
    ['ContinueStatement'],
  ],
  BreakStatement: [['break', ';']],
  ContinueStatement: [['continue', ';']],
  Block: [
    ['{', '}'],
    ['{', 'StatementList', '}'],
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
  WhileStatement: [['while', '(', 'Expression', ')', 'Statement']],
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

// lr 构建 ast 过程
export function parse(source) {
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
