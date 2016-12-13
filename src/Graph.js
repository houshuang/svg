import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Lines from './Lines'
import Activities from './Activities'
import { LevelLines, PanMap } from './fixed_components'

export default class Graph extends Component { 
  constructor(props) {
    super(props);
    this.state = {offset: null}
  }
  componentDidMount() {
    this.setState({offset: findDOMNode(this).getBoundingClientRect()})
  }
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
    const { width, height, hasPanMap, viewBox, scaleFactor = 1 } = this.props
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
          <Lines />
          <Activities />
        </svg>
        { !!hasPanMap && <PanMap scaleFactor={scaleFactor} /> }
      </svg>
    )
  }
}
          // { !!dragging && <Line coords={[dragFrom[0], dragFrom[1], ...dragCoords]} /> }
          // { true ? null:  <Lines />
          // }
