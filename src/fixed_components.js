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

export const TimeScale = () => {
      let a = 0
      let res = []
      while(a < 121) {
        a += 1
        let text = null
        let length = 0

        const x = a * (3900/120)
        if(a % 15 === 0) {
          length = 30
          text = <text x={x-15} y={540}>{a + ' min.'}</text>
        } else if (a % 5 === 0) {
          length = 15
        } else { 
          length = 5
        }
              
        res.push(
          <g key={a}>
          <line
            x1={x}
            y1={600 - length}
            x2={x}
            y2={600}
            stroke='grey' />
          { text }
        </g>
        )
      }
  return (<g>{res}</g>)
}
