// ll lr
// 终结符 非终结符
// token   terminal symbol
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
  Literal: [['Number']],
  IfStatement: [['if', '(', 'Expression', ')', 'Statement']],
  VariableDeclaration: [['var', 'Identifier']],
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
    queue.push(symbol)
  }
  // 展开一层closure
  while (queue.length) {
    let symbol = queue.shift()
    console.log(symbol)
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
        current.$isRuleEnd = true
      }
    }
  }

  for (let symbol in state) {
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
//1
