let pattern = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
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
        pattern[i][j] === 2 ? 'X' : pattern[i][j] === 1 ? 'O' : ''
      cell.addEventListener('click', () => move(i, j))

      board.appendChild(cell)
    }
    board.appendChild(document.createElement('br'))
  }
}

function move(x, y) {
  pattern[x][y] = color
  if (check(pattern, color)) {
    alert(color === 2 ? 'X is winner' : 'O is winner')
  }
  color = 3 - color
  show()
  if (willWin(pattern, color)) {
    console.log(color === 2 ? 'X will win' : 'O will win')
  }
}

show(pattern)

function check(pattern, color) {
  for (let i = 0; i < 3; i++) {
    let win = true
    for (let j = 0; j < 3; j++) {
      if (pattern[i][j] !== color) win = false
    }
    if (win) return true
  }

  for (let i = 0; i < 3; i++) {
    let win = true
    for (let j = 0; j < 3; j++) {
      if (pattern[j][i] !== color) win = false
    }
    if (win) return true
  }
  {
    let win = true
    for (let i = 0; i < 3; i++) {
      if (pattern[i][pattern.length - 1 - i] !== color) win = false
    }
    if (win) return true
  }
  {
    let win = true
    for (let i = 0; i < 3; i++) {
      if (pattern[i][i] !== color) win = false
    }
    if (win) return true
  }

  return false
}

function willWin(pattern, color) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i][j]) continue
      let tmp = clone(pattern)
      tmp[i][j] = color
      if (check(tmp, color)) return true
    }
  }
}

function clone(pattern) {
  return JSON.parse(JSON.stringify(pattern))
}
