// 一维 二维 数组 拷贝省空间
let pattern = [
  // [0, 0, 0],
  // [0, 0, 0],
  // [0, 0, 0],
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
]

let color = 1

function show() {
  let board = document.getElementById('board')
  board.innerHTML = ''

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let cell = document.createElement('div')

      cell.classList.add('cell')

      cell.innerText =
        pattern[i * 3 + j] === 2 ? 'X' : pattern[i * 3 + j] === 1 ? 'O' : ''
      cell.addEventListener('click', () => userMove(i, j))

      board.appendChild(cell)
    }
    board.appendChild(document.createElement('br'))
  }
}

function userMove(x, y) {
  pattern[x * 3 + y] = color
  if (check(pattern, color)) {
    alert(color === 2 ? 'X is winner' : 'O is winner')
  }
  color = 3 - color
  show()
  if (willWin(pattern, color)) {
    console.log(color === 2 ? 'X will win' : 'O will win')
  }
  // const { point, result } = bestChoice(pattern, color)
  // console.log(point, result)
  computerMove()
}

function computerMove() {
  const { point } = bestChoice(pattern, color)
  if (point) {
    pattern[point[0] * 3 + point[1]] = color
  }
  console.log(check(pattern, color))
  if (check(pattern, color)) {
    alert(color === 2 ? 'X is winner' : 'O is winner')
  }
  color = 3 - color
  show()
}

function check(pattern, color) {
  for (let i = 0; i < 3; i++) {
    let win = true
    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j] !== color) win = false
    }
    if (win) return true
  }

  for (let i = 0; i < 3; i++) {
    let win = true
    for (let j = 0; j < 3; j++) {
      if (pattern[j * 3 + i] !== color) win = false
    }
    if (win) return true
  }
  {
    let win = true
    for (let i = 0; i < 3; i++) {
      if (pattern[i * 3 + pattern.length / 3 - 1 - i] !== color) win = false
    }
    if (win) return true
  }
  {
    let win = true
    for (let i = 0; i < 3; i++) {
      if (pattern[i * 3 + i] !== color) win = false
    }
    if (win) return true
  }

  return false
}

function willWin(pattern, color) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j]) continue
      let tmp = clone(pattern)
      tmp[i * 3 + j] = color
      if (check(tmp, color)) return [i, j]
    }
  }
  return null
}

function clone(pattern) {
  // return JSON.parse(JSON.stringify(pattern))
  return Object.create(pattern)
}

// 3 个状态
// 进攻 防守 平局
// 要赢 别输 平局
// 1 -1 0
// 找我方最好的 和 我方最差的 以及 不好不坏的
function bestChoice(pattern, color) {
  let p
  if ((p = willWin(pattern, color))) {
    return {
      point: p,
      result: 1,
    }
  }

  let result = -2
  let point = null

  outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j]) continue
      let tmp = clone(pattern)
      tmp[i * 3 + j] = color
      let r = bestChoice(tmp, 3 - color).result

      if (-r > result) {
        result = -r
        point = [i, j]
      }
      if (result === 1) break outer
    }
  }

  return {
    point: point,
    result: point ? result : 0,
  }
}

show(pattern)
