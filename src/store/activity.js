import { observable, computed, action } from 'mobx'
import { store } from './index'
import cuid from 'cuid'
import { between } from '../utils'

export default class Activity {
  @observable title
  @observable plane
  @observable x
  @observable width
  @observable over
  @observable selected
  @observable overdrag
  @action select = () => {
    store.unselect()
    this.selected = true
  }

  @action rename = (newname) => {
    this.title = newname
    store.cancelAll()
  }
  @action move = (deltax) => {
    if(store.mode !== 'moving') { return }
    if(store.overlapAllowed) {
      this.x = (between(0, 4000 - this.width, this.x + (deltax / store.scale)))
    } else {
      const oldx = this.x
      this.x = between((store.leftbound && (store.leftbound.x + store.leftbound.width)), (store.rightbound ? store.rightbound.x - this.width : 4000 - this.width), this.x + (deltax / store.scale))
      if(oldx === this.x && (Math.abs(deltax) !== 0)) {
        this.overdrag += deltax
        if(this.overdrag < -100) {
          store.swapActivities(store.leftbound, this)
          store.stopMoving()
        }
        if(this.overdrag > 100) {
          store.swapActivities(this, store.rightbound)
          this.overdrag = 0
          store.stopMoving()
        }
      }
    }
  }

  @action resize = (deltax) => {
    const rightbound = (this.rightbound && this.rightbound.x) || 4000
    this.width = between(20, rightbound - this.x, this.width + (deltax / store.scale))
    this.mode = 'resizing'
  }
  @action onOver = () => this.over = true
  @action onLeave = () => this.over = false
  @action setRename = () => store.renameOpen = this

  @action init = ( plane, x, title, width, id ) => {
    this.id = id || cuid()
    this.title = title || ''
    this.plane = plane
    this.x = x
    this.width = width
    this.over = false
    this.overdrag = 0
  }

  constructor(...args) {
    this.init(...args)
  }

  @computed get y() {
    const offset = store.activityOffsets[this.id]
    return (this.plane * 100) + 50 - (offset * 30)
  }
}
