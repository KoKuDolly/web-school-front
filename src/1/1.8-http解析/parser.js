const EOF = Symbol('EOF')

function data(c) {
    if (c === '<') {
        return tagOpen
    } else if (c === EOF) {
        return
    } else {
        return data
    }
}

function tagOpen(c) {
    if (c === '/') {
        return endTagOpen
    } else if (c.match(/^[A-z]$/)) {
        return tagName(c)
    } else {
        return
    }
}

function endTagOpen(c) {
    if (c.match(/^[A-z]$/)) {
        return tagName(c)
    } else if (c === '>') {

    } else if (c === EOF) {

    } else { }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c.match(/^[A-z]$/)) {
        return tagName
    } else if (c === '>') {
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName(c) {

}

function selfClosingStartTag() { }

module.exports.parseHTML = function parseHTML(html) {
    console.log(html)
    let state = data
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF)
}