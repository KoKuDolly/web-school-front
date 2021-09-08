// letcode 28
// kmp

function kmp(source, pattern) {
  // table
  let table = new Array(pattern.length).fill(0)

  {
    let i = 1
    let j = 0

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i += 1
        j += 1
        table[i] = j
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          i += 1
        }
      }
    }
  }

  console.log(table)

  // abcdabce
  // aabaaac
  // 匹配

  {
    let i = 0
    let j = 0

    while (i < source.length) {
      if (pattern[j] === source[i]) {
        i += 1
        j += 1
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          i += 1
        }
      }
      if (j === pattern.length) {
        return true
      }
    }
    return false
  }
}

kmp('', 'abcdabce')
kmp('', 'abababc')
kmp('', 'aabaaac')
