import React from 'react'
import { observer } from 'mobx-react'
import { connect } from './store'

const DragGuide = observer(({x}) =>
  <line
    fill='grey'
    stroke='grey'
    x1={x}
    y1={0}
    x2={x}
    y2={600}
    strokeWidth={1} 
    strokeDasharray='5,5'/> 
)


export default connect(({ store: {leftbound, rightbound, mode} })=> {
  if(mode === 'resizing') {
    return (rightbound ? <DragGuide x={rightbound.x} /> : null )
  }
  if(mode === 'moving') {
    return (
      <g>
      { leftbound ? <DragGuide x={leftbound.x + leftbound.width} /> : null }
      { rightbound ? <DragGuide x={rightbound.x} /> : null }
      </g>
    )
  }
  return null
})
