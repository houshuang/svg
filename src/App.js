import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import { DraggableCore } from 'react-draggable'
import './App.css';

// id, level, x, title
const activities = [
  [1, 1, 30, 'Video'],
  [2, 2, 60, 'Quiz'],
  [3, 1, 150, 'Hello'],
  [4, 3, 300, 'Something'],
  [5, 4, 900, 'Quiz'],
  [6, 5, 1500, 'Forum'],
  [7, 5, 3900, 'Final'],
  [8, 5, 2500, 'Final'],
  [9, 5, 3000, 'Final']
]


const SBox = ({ x, level, title, rest }) =>
  <g>
    <rect x={x} y={(level * 100) + 50 } fill='white' stroke='grey' rx={10} width={100} height={30} {...rest} />
    <text x={x + 3} y={(level * 100) + 70 }>{title}</text>
  </g>

  class PanMap extends Component {
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

class Graph extends Component { 
  render() {
    const { boxX, boxY, width, height, hasPanMap, scaleFactor = 1, moved, ...rest} = this.props
    return (
      <svg width={width} height={height} >
        <svg {...rest} >
         <rect x={0} y={0} fill='#fcf9e9' stroke='transparent' rx={10 * scaleFactor} width={width * Math.max(4, scaleFactor)} height={height * scaleFactor} />
        { activities.map( ([id, level, x, title]) => <SBox key={id} level={level} x={x} title={title} /> ) }
      </svg>
        <rect x={0} y={0} fill='transparent' stroke='grey' strokeWidth={1} rx={10} width={width} height={height} />
        { !!hasPanMap && <PanMap scaleFactor={scaleFactor} moved={moved}/> }
      </svg>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {x: 0, y: 0, move: 0}
  }

  pan = (x) => {
    this.setState({x: x})
  }

  mouseMove = (e) => {
    const svg = findDOMNode(this.refs.svg)
    const {left, top} = svg.getBoundingClientRect()
    this.setState({x: e.clientX - left, y: e.clientY - top})
    e.stopPropagation()
    e.preventDefault()
  }


  render() {
    return (
      <div className="App" >
        <br/>
        <Graph ref='svg' width={1000} height={600}
          viewBox={`${this.state.x} 0 1000 600`} preserveAspectRatio='xMinYMin slice' scaleFactor={1} />
        <p/>
        <Graph width={1000} height={150}
          viewBox={'0 0 4000 600'} preserveAspectRatio='xMinYMin slice' hasPanMap scaleFactor={4} moved={this.pan}/>
      </div>
    )
  }
}

export default App
