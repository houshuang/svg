import { observable, computed, action } from 'mobx'
import cuid from 'cuid'

export default class Activity {
  @observable title
  @observable plane
  @observable x
  @observable width
  @observable over
  @action move = (deltax) => this.x += deltax 
  @action resize = (deltax) => this.width += deltax 
  @action onOver = () => this.over = true
  @action onLeave = () => this.over = false

  @action init = ( plane, x, title, width, id ) => {
    this.id = id || cuid()
    this.title = title
    this.plane = plane
    this.x = x
    this.width = width
    this.over = false
  }

  constructor(...args) {
    this.init(...args)
  }

  @computed get y() { return (this.plane * 100) + 50 }
}
