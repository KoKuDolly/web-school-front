function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    for (var prop in element.computedStyle) {
        // var p = element.computedStyle.value // 这句没用到
        element.style[prop] = element.computedStyle[prop].value
        // 带有 px 后缀的字符串
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
        // 纯数字的字符串
        if (element.style[prop].toString().match(/^[\d\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style
}

function layout(element) {
    if (!element.computedStyle) return
    var elementStyle = getStyle(element)
    if (elementStyle.display !== 'flex') {
        return
    }
    // 只处理 element 节点，过滤掉 文本 其他节点
    var items = element.children.filter(e => e.type === 'element')
    // TODO: 为什么有order属性
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0)
    })
}

module.exports = layout