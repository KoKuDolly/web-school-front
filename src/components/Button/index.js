import { Component, createElement } from '@/libs/framework'

export class Button extends Component {
  constructor() {
    super()
  }
  render() {
    this.childContainer = <span />
    this.root = (<div>{this.childContainer}</div>).render()
    return this.root
  }
  appendChild(child) {
    if (!this.childContainer) this.render() // ensure
    this.childContainer.appendChild(child)
  }
}
