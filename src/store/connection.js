import cuid from 'cuid'
import { drawPath } from '../path'
import { observable, action, computed } from 'mobx'
import { store } from './index'

export default class Connection {
  @observable source
  @observable target
  @observable selected
  @action select = () => this.selected = true
  @action init = (source, target, id) => {
    this.source = source
    this.target = target
    this.id = id || cuid()
  }

  constructor(...args) {
    this.init(...args)
  }

  @computed get path() {
    return( drawPath(
      this.source.x + this.source.width,
      (this.source.plane * 100) + 65,
      this.target.x,
      (this.target.plane * 100) + 65)
    )
  }
  @computed get pathScaled() {
    const x = this.source.x * store.scale
    const width = this.source.width * store.scale
    const x2 = this.target.x * store.scale
    return( drawPath(
      x + width,
      (this.source.plane * 100) + 65,
      x2,
      (this.target.plane * 100) + 65)
    )
  }
}

