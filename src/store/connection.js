import cuid from 'cuid'
import { drawPath } from '../path'
import { observable, action, computed } from 'mobx'

export default class Connection {
  @observable source
  @observable target
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
}

