import React, { Component } from 'react' 
import { DraggableCore } from 'react-draggable'

export class PanMap extends Component {
  constructor(props) {
    super(props)
    this.state = {x: 0}
  }
  handleDrag = (e, {node, deltaX, deltaY}) => {
    const newX = Math.min(Math.max(this.state.x + (deltaX), 0), 750)
    this.setState({x: newX })
    this.props.moved(Math.min(3000, this.state.x * 4))
  }

  render() { 
    const { scaleFactor } = this.props

    return(
      <DraggableCore onDrag={this.handleDrag}>
        <rect 
          x={this.state.x} 
          y={0} 
          fill='transparent' 
          stroke='black' 
          strokeWidth={scaleFactor} 
          rx={10} 
          width={250} 
          height={150} />
      </DraggableCore>
    )
  }
}

export const LevelLines = () => 
  <g>
    {[1,2,3].map(x =>
      <line 
        key={x} 
        x1={0} 
        y1={( x * 100) + 65} 
        x2={4000} 
        y2={( x * 100) + 65} 
        stroke='grey' 
        strokeWidth={1} 
        strokeDasharray='5,5'/> 
    )}
  </g>
