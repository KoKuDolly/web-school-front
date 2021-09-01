# xml sgml

## 01

DTD: 转义符，实体，nbsp amp(&) lt gt

namespace: XHTML, HTML, MathML, SVG

HMTL5: XHTML(XML namespace), HTML5

## 02 HTML 语义

语义化标签

```html
<html>
  <head></head>
  <body>
    <aside>aside</aside>
    <main>
      <article>
        <hgroup>
          <h1></h1>
          <!-- css 画一条水平线 -->
          <h2></h2>
        </hgroup>
        <!-- 段落 -->
        <p class="note">
          <!-- 缩写 -->
          <abbr></abbr>
          <!-- 重要性 -->
          <strong></strong>
          <!-- 重音 -->
          <em></em>
        </p>
        <!-- 区域 -->
        <figure>
          <!-- 区域标题 -->
          <figcaption></figcaption>
          <img src="xxx" />
        </figure>
        <!-- 内容 content -->
        <!-- <ul> <ol> <dl> <dt> <dd> <li> -->
        <!-- 导航 -->
        <nav></nav>
        <!-- 定义 define -->
        <dfn><dfn>
        <!-- 保留格式 -->
        <pre>
            &lt;html>
            &lt;/html>
        </pre>
        <!-- 例子 -->
        <samp><samp>
      </article>
      <!-- 代码块 -->
      <code></code>
      <footer></footer>
    </main>
  </body>
</html>
```

## 03 HTML 语法

合法元素: Element Text Comment DocumentType ProcessingInstruction(预处理，设计的不成功，我们用别的预处理 less，sass 等？) CDATA 文本的另一种语法表达

字符引用: &#161; &amp; &lt; &quot;

## 04 DOM api

节点

Node Element Document CharacterData DocumentFragment DocumentType
Event
Range

导航操作

修改操作
appendChild
insertBefore
removeChild
replaceChild

高级操作
compareDocumentPosition
contains
isEqualNode
isSameNode
cloneNode

## 05 事件 api

事件模型

```js

addEventListener(type, listener, [, options ])

{
    capture: false, // true 先捕获，后冒泡 false 冒泡，阻止了捕获
    once: false,
    passive: false // onscroll 等高频行为优化参数，阻止默认行为，设为true
}
```

## 06 Rande api

```js
function reverseChildren(element) {
  var l = element.childNodes.length
  while (l-- > 0) {
    element.appendChild(element.childNodes[l])
  }
}
// range api

function reverseChildren(element) {
  let range = new Range()
  range.selectNodeContents(element)

  let fragment = range.extractContents() // 这句会把元素从dom中拿走
  let l = fragment.childNodes.length
  while (l-- > 0) {
    fragment.appendChild(fragment.childNodes[l])
  }

  element.appendChild(fragment) // fragment 放入dom中
}
```

## CSSOM

## CSSOM View

**window**

window.innerHeight window.innerWidth
window.outerHeight window.outerWidth
window.devicePixelRatio
window.screen

window.open('about:blank', 'blank', 'width=100, height=100,left=100,right=100')

moveTo(x, y)
mobeBy(x, y)
resizeTo(x, y)
resizeBy(x, y)

**scroll**

scrollTy
scrollintoView

**layout** 盒子模型

getClientRects() // 多个盒

getBoundingClientRect() // 一个盒

## 其他浏览器 api

做一个实验，整理所有浏览器的 api

khronos: WebGL

ECMA: ECMAScript

WHATWG: HTML

W3C: webaudio, CG(社区工作组)/WG(实际工作组)
