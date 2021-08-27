import { createElement } from '@/libs/framework'
import { Carousel } from '@/components/carousel/carousel'
import { Timeline, Animation } from '@/components/animation/animation'

let images = [
  require('@/images/05.webp'),
  require('@/images/07.webp'),
  require('@/images/08.webp'),
  require('@/images/09.webp'),
]

let a = <Carousel src={images} />

a.mountTo(document.body)

let tl = new Timeline()

window.tl = tl
window.animation = new Animation(
  {
    set a(v) {
      // console.log(v)
    },
  },
  'a',
  1,
  100,
  1000,
  null
)

// tl.add(
//   new Animation(
//     {
//       set a(v) {
//         console.log(v)
//       },
//     },
//     'a',
//     1,
//     100,
//     1000,
//     null
//   )
// )

tl.start()
