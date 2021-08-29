import { createElement } from '@/libs/framework'
// import { Carousel } from '@/components/carousel/carousel'
// import { Button } from '@/components/Button/'
import { List } from '@/components/List/'
// import { Timeline, Animation } from '@/components/animation/animation'

let images = [
  { img: require('@/images/05.webp'), url: 'www.github.com', title: '123' },
  { img: require('@/images/07.webp'), url: 'www.github.com', title: '123' },
  { img: require('@/images/08.webp'), url: 'www.github.com', title: '123' },
  { img: require('@/images/09.webp'), url: 'www.github.com', title: '123' },
]

// let a = (
//   <Carousel
//     src={images}
//     onChange={(event) => {
//       //console.log(event.detail.position)
//     }}
//     onClick={(e) => (window.location.href = e.detail.data.url)}
//   />
// )

// children 机制 模板型（函数），普通型
// button list
// 普通型
// let a = <Button>button</Button>
// 模板型children
let a = (
  <List data={images}>
    {(record) => (
      <div>
        <img src={record.img} />
        <a href={record.url}>{record.title}</a>
      </div>
    )}
  </List>
)

a.mountTo(document.body)
