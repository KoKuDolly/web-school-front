function match(string) {
    let state = start
    for (let c of string) {
        state = state(c)
    }
    return state === end
}

function start(c) {
    if (c === 'a') {
        return foundA;
    } else {
        return end
    }
}

function end () {
    return end
}

function foundA(c) {
    if (c === 'b') {
        return start(c)
    }
}


console.log(match('abababx'))