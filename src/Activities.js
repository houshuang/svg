import React from 'react'
import { DraggableCore } from 'react-draggable'
import { connect } from './store'

const Activity = connect(({ store: { onOver }, activity }) => {
  const { x, y, width, title, highlighted } = activity
  return (
    // record that mouse moves over box, for linking/highlighting
    <g onMouseOver={() => onOver(activity)}>
      <rect 
        x={x} 
        y={y} 
        fill={!highlighted ? 'transparent' : 'yellow'}
        stroke='grey' 
        rx={10} 
        width={width} 
        height={30} />
      <text 
        x={x + 3} 
        y={y + 20} >
        {title}
      </text>
      <circle 
        cx={x + width - 10} 
        cy={y + 15 } 
        r={5} 
        fill='transparent' 
        stroke='black'
      />
      
    <DraggableCore>
        <circle 
          cx={x + width - 10} 
          cy={y + 15 } 
          r={10} 
          fill='transparent' 
          stroke='transparent' 
          style={{cursor: 'crosshair'}} />
      </DraggableCore>

      <DraggableCore>
      <rect
        fill='transparent'
        stroke='transparent'
        x={x + width - 5}
        y={y}
        width={5}
        height={30}
        style={{cursor: 'ew-resize'}} />
    </DraggableCore>
    <DraggableCore>
      <rect 
        x={x} 
        y={y} 
        fill='transparent'
        stroke='transparent' 
        width={width - 20} 
        height={30} 
        style={{cursor: 'move'}} />
      </DraggableCore>
  </g>
  )
})

export default connect(({ store: { activities }} ) => 
  <g>
    { activities.map(x => <Activity activity={x} key={x.id} />) }
  </g>
)
