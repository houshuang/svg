import cuid from 'cuid'
import { computed, action, observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { initialConnections, initialActivities } from './data'
import { drawPath } from './path'

const getid = (ary, id) => {
  const res = ary.filter(x => x.id === id)
  return(res && res[0])
}


class Activity {
  @observable name
  @observable plane
  @observable x
  @observable width

  constructor(plane, x, name, width, id) {
    this.id = id || cuid()
    this.name = name
    this.plane = plane
    this.x = x
    this.width = width
  }
  @action resize = (new_length) => this.length = new_length
  @action move = (new_x) => this.x = new_x

  @computed get y() { return (this.plane * 100) + 50 }
}

class Connection {
  @observable source
  @observable target

  constructor(source, target, id) {
    this.source = source
    this.target = target
    this.id = id || cuid()
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

class Store {
  constructor() {
    this.panx = 0
    this.mode = null
    this.activities = initialActivities.map(x => new Activity(...x))
    this.connections = initialConnections.map(x => 
      new Connection(getid(this.activities, x[0]), getid(this.activities, x[1])))
  }

  @observable connections 
  @action addConnection = (from, to) => this.connections.push([from, to]) 

  @observable activities 

  @observable mode 
  @observable draggingFrom
  @observable dragCoords

  // user begins dragging a line to make a connection
  @action connectStart = (id, x, y) => {
    this.mode = 'dragging'
    this.draggingFrom = [x, y]
  }

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = null
    this.draggingFrom = []
    this.dragCoords = []
  }

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta, ydelta) => this.dragCoords = [xdelta, ydelta]

  @observable panx 
  @action panDelta = (deltaX) => 
    this.panx = Math.min(Math.max(this.panx + (deltaX), 0), 750)
  
  @computed get panOffset() { return this.panx * 4 }
}

export const store = new Store()
window.store = store // for debugging

export const connect = (comp) => inject('store')(observer(comp))
