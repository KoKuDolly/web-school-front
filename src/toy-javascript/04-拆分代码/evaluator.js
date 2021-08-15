import {
  ExecutionContext,
  Reference,
  Realm,
  JSValue,
  JSNumber,
  JSString,
  JSBoolean,
  JSNull,
  JSUndefined,
  JSObject,
  JSSymbol,
  CompletionRecord,
  EnvironmentRecord,
  ObjectEnvironmentRecord,
} from './runtime.js'

export class Evaluator {
  constructor() {
    this.realm = new Realm()
    this.globalObject = new JSObject()
    this.globalObject.set('log', new JSObject())
    this.globalObject.get('log').call = (args) => {
      console.log(args)
    }
    // stack
    this.ecs = [
      new ExecutionContext(
        this.realm,
        new ObjectEnvironmentRecord(this.globalObject),
        new ObjectEnvironmentRecord(this.globalObject)
      ),
    ]
  }

  // 语义分析 this.evaluate ==> eval ???
  evaluate(node) {
    if (this[node.type]) {
      return this[node.type](node)
    }
  }

  Program(node) {
    return this.evaluate(node.children[0])
  }
  StatementList(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    } else {
      let record = this.evaluate(node.children[0])
      if (record.type === 'normal') return this.evaluate(node.children[1])
      return record
    }
  }
  Statement(node) {
    return this.evaluate(node.children[0])
  }
  VariableDeclaration(node) {
    // console.log('Declare variable', node.children[1])
    let runningEC = this.ecs[this.ecs.length - 1]
    // runningEC.variableEnvironment[node.children[1].name] = new JSUndefined()
    runningEC.lexicalEnvironment.add([node.children[1].name, new JSUndefined()])
    return new CompletionRecord('normal', new JSUndefined())
  }
  ExpressionStatement(node) {
    let r = this.evaluate(node.children[0])
    if (r instanceof Reference) r = r.get()
    return new CompletionRecord('normal', r)
  }
  Expression(node) {
    return this.evaluate(node.children[0])
  }
  AdditiveExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    } else {
      let left = this.evaluate(node.children[0])
      let right = this.evaluate(node.children[2])
      if (left instanceof Reference) left = left.get()
      if (right instanceof Reference) right = right.get()
      if (node.children[1].type === '+') {
        return new JSNumber(left.value + right.value)
      }
      if (node.children[1].type === '-') {
        return new JSNumber(left.value - right.value)
      }
    }
  }
  MultiplicativeExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    } else {
      // TODO
    }
  }
  PrimaryExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    } else {
      // TODO
    }
  }
  Literal(node) {
    return this.evaluate(node.children[0])
  }
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
    return new JSNumber(node.value)
  }
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
    // return result.join('')

    return new JSString(result)
  }
  BooleanLiteral(node) {
    return new JSBoolean(node.value)
  }
  NullLiteral() {
    return new JSNull()
  }
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
  }
  PropertyList(node, object) {
    if (node.children.length === 1) {
      this.Property(node.children[0], object)
    } else {
      this.PropertyList(node.children[0], object)
      this.Property(node.children[2], object)
    }
  }
  Property(node, object) {
    let name
    if (node.children[0].type === 'Identifier') {
      name = node.children[0].name
    }
    if (node.children[0].type === 'StringLiteral') {
      name = this.evaluate(node.children[0])
    }
    object.set(name, {
      value: this.evaluate(node.children[2]),
      enumerable: true,
      configurable: true,
      writable: true,
    })
  }
  AssignmentExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    }
    let left = this.evaluate(node.children[0])
    let right = this.evaluate(node.children[2])
    left.set(right)
  }
  LogicalORExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    }
    let result = this.evaluate(node.children[0])
    if (result) {
      return result
    } else {
      return this.evaluate(node.children[2])
    }
  }
  LogicalANDExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    }
    let result = this.evaluate(node.children[0])
    if (!result) {
      return result
    } else {
      return this.evaluate(node.children[2])
    }
  }
  LeftHandSideExpression(node) {
    return this.evaluate(node.children[0])
  }
  CallExpression(node) {
    if (node.children.length === 2) {
      let func = this.evaluate(node.children[0])
      let args = node.children[1]
      return func.call(null, args)
    }
    // return this.evaluate(node.children[0])
  }
  NewExpression(node) {
    if (node.children.length === 2) {
      let cls = this.evaluate(node.children[1])
      return cls.construct()
      // new 执行的操作
      //   let object = this.realm.Object.construct()
      //   let cls = this.evaluate(node.children[1])
      //   let r = cls.call(object)
      //   if (typeof r === 'object') {
      //     return r
      //   } else {
      //     return object
      //   }
    } else {
      return this.evaluate(node.children[0])
    }
  }
  MemberExpression(node) {
    if (node.children.length === 1) {
      return this.evaluate(node.children[0])
    }
    if (node.children.length === 3) {
      let obj = this.evaluate(node.children[0]).get() // map
      let prop = obj.get([node.children[2].name]) // 得到一个descriptor对象
      if ('value' in prop) return prop.value
      if ('get' in prop) return prop.get.call(obj)
    }
    if (node.children.length === 4) {
      let obj = this.evaluate(node.children[0]) // map
      return obj.get([node.children[2].name])
    }
  }
  IfStatement(node) {
    let condition = this.evaluate(node.children[2])
    let statement = this.evaluate(node.children[4])
    if (condition instanceof Reference) {
      condition = condition.get()
    }
    if (condition.toBoolean().value) {
      return this.evaluate(statement)
    }
  }
  WhileStatement(node) {
    while (true) {
      let condition = this.evaluate(node.children[2])
      let statement = this.evaluate(node.children[4])
      if (condition instanceof Reference) {
        condition = condition.get()
      }
      if (condition.toBoolean().value) {
        let record = this.evaluate(statement)
        if (record.type === 'continue') continue
        if (record.type === 'break') return new CompletionRecord('normal') // break 消费掉的时候，状态zhiwei normal
      } else {
        // break 消费掉的时候，状态zhiwei normal
        return new CompletionRecord('normal')
      }
    }
  }
  BreakStatement() {
    return new CompletionRecord('break')
  }
  ContinueStatement() {
    return new CompletionRecord('continue')
  }
  Identifier(node) {
    // 唯一标识符
    let runningEC = this.ecs[this.ecs.length - 1] // 运行时取栈顶的运行上下文
    return new Reference(runningEC.lexicalEnvironment, node.name) // .get()
    // 通过Reference类型，获取当前环境的指定标识符
    // return runningEC.lexicalEnvironment[node.name] 是草率的做法，只能获取，不能写，例如let a = b，b是可读，a是可写。
  }
  Arguments(node) {
    if (node.children.length === 2) {
      return []
    } else {
      return this.evaluate(node.children[1])
    }
  }
  ArgumentsList(node) {
    if (node.children.length === 1) {
      let result = this.evaluate(node.children[0])
      if (result instanceof Reference) {
        result = result.get()
      }
      return [result]
    } else {
      let result = this.evaluate(node.children[2])
      if (result instanceof Reference) {
        result = result.get()
      }
      return this.evaluate(node.children[0]).concat(result)
    }
  }
  Block(node) {
    if (node.children.length === 2) return

    let runningEC = this.ecs[this.ecs.length - 1]
    let newEC = new ExecutionContext(
      runningEC.realm,
      new EnvironmentRecord(runningEC.lexicalEnvironment),
      runningEC.variableEnvironment
    )
    this.ecs.push(newEC)
    let result = this.evaluate(node.children[1])
    this.ecs.pop(newEC)
    return result
  }
  EOF() {
    return null
  }
}
