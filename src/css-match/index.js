// console.log(document.getElementById('id'))

function match(selector, element) {
    // console.log(element.getAttribute('id'))
    // console.log(element.getAttribute('class'))
    // console.log(element.attributes)
    let str = ''
    let flag = false
    for (let i of element.attributes) {
        // console.log(i.name, i.value, i.ownerElement, i.ownerElement.parentNode, i.ownerElement.parentNode.localName)
        if (i.ownerElement.parentNode.localName && !flag) {
            str = i.ownerElement.parentNode.localName + ' ' + str
            flag = true
        }
        if (i.name === 'id') {
            str += '#' + i.value
        }
        if (i.name === 'class') {
            str += '.' + i.value
        }
    }
    // console.log(str, `${str}`)
    // return selector.match(str)
    return selector === str
    // RegExp.test()
    // String.search()

}

const result = match("div #app.my-class", document.getElementById('app'))
console.log(result)