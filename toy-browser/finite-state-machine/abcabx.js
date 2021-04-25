function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c);
    }
    return state === end
}

function start(c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start(c);
    }
}

function foundA(c) {
    if (c === 'b') {
        return foundB;
    } else {
        return start(c);
    }
}

function foundC(c) {
    if (c === 'c') {
        return start;
    } else {
        return start(c);
    }
}

function foundB(c) {
    if (c === 'x') {
        return end;
    } else {
        return foundC(c);
    }
}

function end(c) {
    return end;
}
console.log(match('abcabax'))