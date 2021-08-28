import { createElement } from '@/libs/framework'
import { Carousel } from '@/components/carousel/carousel'
// import { Timeline, Animation } from '@/components/animation/animation'

let images = [
  { img: require('@/images/05.webp'), url: 'www.github.com' },
  { img: require('@/images/07.webp'), url: 'www.github.com' },
  { img: require('@/images/08.webp'), url: 'www.github.com' },
  { img: require('@/images/09.webp'), url: 'www.github.com' },
]

let a = (
  <Carousel
    src={images}
    onChange={(event) => {
      //console.log(event.detail.position)
    }}
    onClick={(e) => (window.location.href = e.detail.data.url)}
  />
)

a.mountTo(document.body)
