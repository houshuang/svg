import cuid from "cuid";
import { drawPath } from "../path";
import { observable, action, computed } from "mobx";
import { store } from "./index";
import { timeToPx } from '../utils'

export default class Operator {
  @observable x
  @observable y
  @action init(x, y) {
    this.x = x
    this.y = y
    this.id = cuid()
  }

  constructor(...args) {
    this.init(...args);
  }

  @computed get coordsScaled() {
    const rawX = timeToPx(this.x, store.scale)
    return [rawX, this.y]
  }

  @computed get coords() {
    const rawX = timeToPx(this.x, 1)
    return [rawX, this.y]
  }

}
