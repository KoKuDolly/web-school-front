// ll lr
// 终结符 非终结符
let syntax = {
  Program: [['StatementList', 'EOF']],
  StatementList: [['Statement'], ['StatementList', 'Statement']],
  Statement: [
    ['ExpressionStatement'],
    ['IfStatement'],
    ['VariableDeclaration'],
    ['FunctionDeclaration'],
  ],
  ExpressionStatement: [['AdditiveExpression']],
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
let end = {
  isEnd: true,
}
let start = {
  Program: end,
}
function closure(state) {
  let queue = []
  for (let symbol in state) {
    queue.push(symbol)
  }
  while (queue.length) {
    let symbol = queue.shift()
    if (syntax[symbol])
      for (let rule of syntax[symbol]) {
        queue.push(rule[0])
        console.log(rule[0])
      }
  }
}

closure(start)
