import cuid from 'cuid'
import { computed, action, observable, useStrict } from 'mobx'
import { observer, inject } from 'mobx-react'
import { initialConnections, initialActivities } from './data'
import { drawPath } from './path'

useStrict(true)

const getid = (ary, id) => {
  const res = ary.filter(x => x.id === id)
  return(res && res[0])
}

class Activity {
  @observable name
  @observable plane
  @observable x
  @observable width
  @observable over
  @action move = (deltax) => this.x += deltax 
  @action resize = (deltax) => this.width += deltax 
  @action onOver = () => this.over = true
  @action onLeave = () => this.over = false

  @action init = ( plane, x, name, width, id ) => {
    this.id = id || cuid()
    this.name = name
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

class Connection {
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

class Store {
  @action init = () => {
    this.panx = 0
    this.mode = null
    this.activities = initialActivities.map(x => new Activity(...x))
    this.connections = initialConnections.map(x => new Connection(getid(this.activities, x[0]), getid(this.activities, x[1]))
    )
  }

  constructor() {
    this.init()
  }

  @observable connections 
  @observable currentlyOver
  @action addConnection = (from, to) => this.connections.push([from, to]) 
  @action onOver = (activity) => {
    if (this.mode === 'dragging') {
      
    }
  }
  @computed get highlighted() { 
    return this.mode === 'dragging' && (this.currentlyOver !== this.draggingFromActivity) && this.currentlyOver
  }

  @observable activities 

  @observable mode 
  @observable draggingFrom
  @observable draggingFromActivity
  @observable dragCoords

  // user begins dragging a line to make a connection
  @action startDragging = (activity) => {
    this.mode = 'dragging'
    const coords = [activity.x + activity.width - 10, activity.y + 15]
    this.draggingFrom = [...coords]
    this.draggingFromActivity = activity
    this.dragCoords = [...coords]
  }
  @action dragging = (deltax, deltay) => this.dragCoords = [this.dragCoords[0] + deltax, this.dragCoords[1] + deltay]
  @computed get dragPath() { return this.mode === 'dragging' ? drawPath(...this.draggingFrom, ...this.dragCoords) : null }
  @action stopDragging = () => {
    this.mode = ''
    const targetAry = this.activities.filter(x => x.over)
    if(targetAry.length > 0) { 
      this.connections.push(new Connection(this.draggingFromActivity, targetAry[0]))
    }
  }

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = null
    this.cancelScroll()
    this.draggingFrom = []
    this.dragCoords = []
  }
  @observable scrollIntervalID
  @action storeInterval = (interval) => {
    this.scrollIntervalID = interval
  }
  @action cancelScroll = () => {
    window.clearInterval(this.scrollIntervalID)
    this.scrollIntervalID = false
  }

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta, ydelta) => this.dragCoords = [xdelta, ydelta]

  @observable panx 
  @action panDelta = (deltaX) => {
    if(this.mode === 'dragging') { 
      this.dragCoords[0] += (deltaX * 4)
      console.log(this.dragCoords)
    }
    this.panx = Math.min(Math.max(this.panx + (deltaX), 0), 750)
  }
  
  @computed get panOffset() { return this.panx * 4 }
}

export const store = new Store()
window.store = store // for debugging

export const connect = (comp) => inject('store')(observer(comp))
