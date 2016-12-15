import { computed, action, observable } from 'mobx'
import { initialConnections, initialActivities } from '../data'
import { drawPath } from '../path'
import Activity from './activity'
import Connection from './connection'

const getid = (ary, id) => {
  const res = ary.filter(x => x.id === id)
  return(res && res[0])
}

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
const calculateBounds = (activity, activities) => {
  const sorted = activities.filter(x => x.id !== activity.id).sort((a, b) => a.x - b.x)
  const leftbound = sorted.filter(act => act.x <= activity.x).pop()
  const rightbound = sorted.filter(act => act.x >= (activity.x + activity.width)).shift()
  return([leftbound, rightbound])
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
  @observable activities 

  @observable mode 
  @observable draggingFromA
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
  @observable leftbound
  @observable rightbound

  @action startResizing = (activity) => {
    this.mode = 'resizing'
    this.currentlyResizingActivity = activity
    this.rightbound = calculateBounds(activity, this.activities)[1]
  }
  @action startMoving = (activity) => {
    this.mode = 'moving'
    this.currentlyMovingActivity = activity
    let [leftbound, rightbound] = calculateBounds(activity, this.activities)
    this.leftbound = leftbound
    this.rightbound = rightbound
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
        this.currentlyResizingActivity.resize(deltaX * 4)
      }
      if(this.mode === 'moving') { 
        this.currentlyMovingActivity.move(deltaX * 4)
      }
    }
  }
  
  @computed get panOffset() { return this.panx * 4 }
}

