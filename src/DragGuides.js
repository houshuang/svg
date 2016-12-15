import React from 'react'
import { observer } from 'mobx-react'
import { connect } from './store'

const DragGuide = observer(({ x, current }) => {
  const middle = ((x - current) / 2.0) + current - 5
  return (
    <g>
      <text x={middle} y={300}>
        {Math.abs(x - current)}
      </text>
      <polygon x={middle} y={300} points='492.426,246.213 406.213,160 406.213,231.213 86.213,231.213 86.213,160 0,246.213 86.213,332.427 86.213,261.213
      406.213,261.213 406.213,332.427' transform={`translate(${middle - 17} 300) scale(0.1) `} />
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={600}
        stroke='grey'
        strokeWidth={1} 
        strokeDasharray='5,5'/> 
      <line
        x1={current}
        y1={0}
        x2={current}
        y2={600}
        stroke='grey'
        strokeWidth={1} 
        strokeDasharray='5,5'/> 
      <rect
        stroke='transparent'
        fill='#f9f3d2'
        fillOpacity={0.3}
        x={Math.min(current, x)}
        y={0}
        width={Math.abs(x-current)}
        height={600} />
    </g>
  )
})


export default connect(({ store: {leftbound, rightbound, mode, currentActivity } })=> {
  if(mode === 'resizing') {
    return (rightbound ? <DragGuide x={rightbound.x} current={currentActivity.x + currentActivity.width} /> : null )
  }
  if(mode === 'moving') {
    return (
      <g>
        { leftbound ? <DragGuide x={leftbound.x + leftbound.width} current={currentActivity.x} /> : 
        <DragGuide x={0} current={currentActivity.x} /> }
        { rightbound ? <DragGuide x={rightbound.x} current={currentActivity.x + currentActivity.width} /> : 
        <DragGuide x={4000} current={currentActivity.x + currentActivity.width} /> }
      </g>
    )
  }
  return null
})
