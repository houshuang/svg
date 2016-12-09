import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import { DraggableCore } from 'react-draggable'
import { activities as initialActivities, connections as initialConnections} from './data'
import { Lines, Line, SBox } from './components'
import { LevelLines, PanMap } from './fixed_components'
import './App.css';

class Graph extends Component { 
  constructor(props) {
    super(props);
    this.state = {offset: null, current: null}
  }
  componentDidMount() {
    this.setState({offset: findDOMNode(this).getBoundingClientRect()})
  }
  resizeFn(id) { return (x) => this.props.resizeFn(id, x) }
  moveFn(id) { 
    let top, left
    if(this.state && this.state.offset) {
      left = this.state.offset.left
    } else {
      left = 0
    }

    return (x) => this.props.moveFn(id, x - left + this.props.offset) 
  }

  connectStart(id) { return (x, y) => this.props.connectStart(id, x, y) }
  connectStop(id) { return () => {
    this.props.connect(id, this.state.current)
    this.setState({current: null})
    this.props.connectStop(id) 
  }
  }
  onOver = (id) => () => this.setState({current: id})
  connectDrag(id) { 
    let top, left
    if(this.state && this.state.offset) {
      left = this.state.offset.left
      top = this.state.offset.top
    } else {
      left = 0
      top = 0
    }

    return (x, y) => this.props.connectDrag(id, x-left, y-top) 
  }
  render() {
    const { width, height, hasPanMap, viewBox, dragFrom, dragCoords, dragging, activities, connections, sizeFn, connectorLine, scaleFactor = 1, moved, resizeFn, ...rest} = this.props
    return (
      <svg width={width} height={height} >
        <svg viewBox={viewBox}>
          <rect 
            x={0} 
            y={0} 
            fill='#fcf9e9' 
            stroke='transparent' 
            rx={10 * scaleFactor} 
            width={width * Math.max(4, scaleFactor)} 
            height={height * scaleFactor} />
          <LevelLines />
          <Lines connections={connections} activities={activities} />
          { !!dragging && <Line coords={[dragFrom[0], dragFrom[1], ...dragCoords]} /> }
          { activities.map( ([id, level, x, title, width]) => 
            <SBox 
              highlighted={dragging && this.state.current === id && dragFrom[2] != id}
              resizeFn={this.resizeFn(id)} 
              onOver={this.onOver(id)}
              moveDrag={this.moveFn(id)}
              connectStart={this.connectStart(id)}
              connectStop={this.connectStop(id)}
              connectDrag={this.connectDrag(id)}
              width={width} 
              key={id} 
              level={level} 
              x={x} 
              title={title} /> 
          ) }

        </svg>
        { !!hasPanMap && <PanMap scaleFactor={scaleFactor} moved={moved}/> }
      </svg>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0, 
      y: 0, 
      move: 0, 
      activities: initialActivities.map(x => ([...x, 100])), 
      connections: [...initialConnections],
      dragging: false,
      dragFrom: [],
      dragCoords: []
    }
  }

  pan = (x) => {
    this.setState({x: x})
  }

  connectStart = (id, x, y) => this.setState({dragging: id, dragFrom: [x,y,id]})
  connectStop = () => this.setState({dragging: false, dragFrom: [], dragCoords: []})
  connectDrag = (id, x, y) => this.setState({dragCoords: [x+this.state.x,y]})
  connect = (id1, id2) => {
    if(id1 != id2) {
      this.setState({connections: [...this.state.connections, [id1, id2]]})
    }
  }
  resizeFn = (getid, newl) => {
    this.setState({activities: 
      this.state.activities.map(([id, level, x, t, l]) => id === getid ? [id, level, x, t, newl] : [id, level, x, t, l])})
  } 
  moveFn = (getid, newx) => {
    this.setState({activities: 
      this.state.activities.map(([id, level, x, t, l]) => id === getid ? [id, level, newx, t, l] : [id, level, x, t, l])})
  } 

  render() {
    return (
      <div className="App" >
        <br/>
        <Graph 
          ref='svg' 
          width={1000} 
          height={600}
          viewBox={`${this.state.x} 0 1000 600`} 
          preserveAspectRatio='xMinYMin slice' 
          scaleFactor={1}
          offset={this.state.x}
          connections={this.state.connections} 
          activities={this.state.activities}
          dragFrom={this.state.dragFrom}
          moveFn={this.moveFn}
          dragCoords={this.state.dragCoords}
          dragging={this.state.dragging}
          connectStart={this.connectStart}
          connectStop={this.connectStop}
          connectDrag={this.connectDrag}
          connect={this.connect}
          resizeFn={this.resizeFn}/>
        <p/>
        <Graph 
          width={1000} 
          height={150}
          viewBox={'0 0 4000 600'} 
          preserveAspectRatio='xMinYMin slice' 
          hasPanMap 
          scaleFactor={4} 
          moved={this.pan}
          connections={this.state.connections} 
          activities={this.state.activities} />
      </div>
    )
  }
}

export default App
