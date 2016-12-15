import { observable, computed, action } from 'mobx'
import { store } from './index'
import cuid from 'cuid'

const between = (minval, maxval, x) => {
  minval = minval || 0
  maxval = maxval || 99999
  return (Math.min(Math.max(x, minval), maxval))
}

export default class Activity {
  @observable title
  @observable plane
  @observable x
  @observable width
  @observable over

  @action move = (deltax) => {
    if(store.overlapAllowed) {
      this.x = (between(0, 4000 - this.width, this.x + deltax))
    } else {
      this.x = between((store.leftbound && (store.leftbound.x + store.leftbound.width)), (store.rightbound ? store.rightbound.x - this.width : 4000 - this.width), this.x + deltax)
    }
    this.mode = 'dragging'
  }

  @action resize = (deltax) => {
    this.width = between(20, store.rightbound.x - this.x, this.width + deltax)
    this.mode = 'resizing'
  }
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

  @computed get y() { 
    const offset = store.activityOffsets[this.id]
    return (this.plane * 100) + 50 - (offset * 30)
  }
}
