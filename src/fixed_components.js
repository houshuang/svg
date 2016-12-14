import React from 'react' 
import { DraggableCore } from 'react-draggable'
import { connect } from './store'

export const PanMap = connect(({ store: { panx, panDelta}, scaleFactor }) => 
    <DraggableCore onDrag={(_, {deltaX}) => panDelta(deltaX)}>
      <rect 
        x={panx} 
        y={0} 
        fill='transparent' 
        stroke='black' 
        strokeWidth={scaleFactor} 
        rx={10} 
        width={250} 
        height={150} />
    </DraggableCore>
)

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
