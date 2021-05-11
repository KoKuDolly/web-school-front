// 问题描述：在字符串中找到 'ab' 或者 'abcdef'

function status(string) {
  // return string.indexOf('ab') > -1
  // return string.includes('ab')

  let foundA = false
  for (let c of string) {
    if (c === 'a') {
      foundA = true
    } else if (foundA && c == 'b') {
      return true
    } else {
      foundA = false
    }
  }
  return false
}

const result = status('abc cba')
console.log(result)

function match(string) {
  // return string.indexOf('abcdef') > -1
  // return string.includes('abcdef')
  let foundA = false
  let foundB = false
  let foundC = false
  let foundD = false
  let foundE = false

  for (let c of string) {
    if (c === 'a') {
      foundA = true
    } else if (foundA && c === 'b') {
      foundB = true
      foundA = false
    } else if (foundB && c === 'c') {
      foundC = true
      foundB = false
    } else if (foundC && c === 'd') {
      foundD = true
      foundC = false
    } else if (foundD && c === 'e') {
      foundE = true
      foundD = false
    } else if (foundE && c === 'f') {
      return true
    } else {
      foundA = false
      foundB = false
      foundC = false
      foundD = false
      foundE = false
    }
  }
  return false
}

console.log(match('abcdefg'))
