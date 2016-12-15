import { computed, action, observable } from 'mobx'
import { initialConnections, initialActivities } from '../data'
import { drawPath } from '../path'

import Activity from './activity'
import Connection from './connection'

const getid = (ary, id) => {
  const res = ary.filter(x => x.id === id)
  return(res && res[0])
}

export default class Store {
  @action init = () => {
    this.panx = 0
    this.mode = null
    this.activities = initialActivities.map(x => new Activity(...x))
    this.connections = initialConnections.map(x => new Connection(getid(this.activities, x[0]), getid(this.activities, x[1])))
    this.mode = ''
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
    this.cancelScroll()
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

  @observable currentlyMovingActivity
  @observable currentlyResizingActivity
  @action startResizing = (activity) => {
    this.mode = 'resizing'
    this.currentlyResizingActivity = activity
  }
  @action startMoving = (activity) => {
    this.mode = 'moving'
    this.currentlyMovingActivity = activity
  }

  @action stopMoving = () => {
    this.mode = ''
    this.cancelScroll()
  }
  @action stopResizing = () => {
    this.mode = ''
    this.cancelScroll()
  }

  @computed get scrollEnabled() {
    return !!(['dragging', 'moving', 'resizing'].includes(this.mode))
  }

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta, ydelta) => this.dragCoords = [xdelta, ydelta]

  @observable panx 
  @action panDelta = (deltaX) => {
    const oldpan = this.panx
    this.panx = Math.min(Math.max(this.panx + (deltaX), 0), 750)
    // only add if we actually panned
    if (oldpan !== this.panx) {
      if(this.mode === 'dragging') { 
        this.dragCoords[0] += (deltaX * 4)
      }
      if(this.mode === 'resizing') { 
        this.currentlyResizingActivity.width += (deltaX * 4)
      }
      if(this.mode === 'moving') { 
        this.currentlyMovingActivity.x += (deltaX * 4)
      }
    }
  }
  
  @computed get panOffset() { return this.panx * 4 }
}
