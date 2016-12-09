import React from 'react'
import { DraggableCore } from 'react-draggable'
import { drawPath } from './path'

export const Line = ({ coords: [x1, y1, x2, y2] }) => {
  console.log(drawPath(x1, y1, x2, y2))
  return (
        <path 
          d={drawPath(x1, y1, x2, y2)}
          fill='transparent'
          stroke='grey'
          strokeWidth='2'/>
  )}

export const Lines = ({connections, activities}) =>
  <g>
    {connections.map(([sourceId, targetId]) => {
      const source = activities.filter(x => x[0] === sourceId)[0]
      const target = activities.filter(x => x[0] === targetId)[0]
      return <Line key={sourceId + '' + targetId} coords={[
            source[2] + source[4],
            (source[1] * 100) + 65,
            target[2],
            (target[1] * 100) + 65]} />
    })
    }
  </g>

export const SBox = ({ moveDrag, highlighted, x, level, title, width, resizeFn, connectStart, connectDrag, connectStop, onOver, ...rest }) => {
  const y = (level * 100) + 50
  const preResizeFn = (_, node) => {
    resizeFn(Math.max(50, width + node.deltaX))
  }
  const preConnectDrag = (_, node) => {
    connectDrag(node.x, node.y)
  }
  const preMoveDrag = (_, node) => {
    moveDrag(node.x)
  }
  const preConnectStart = () => {
    connectStart(x + width - 10, y + 15)
  }
  
  return(
    <g onMouseOver={onOver}>
      <rect 
        x={x} 
        y={y} 
        fill={!highlighted ? 'transparent' : 'yellow'}
        stroke='grey' 
        rx={10} 
        width={width} 
        height={30} 
        {...rest} />
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
      
      <DraggableCore
        onStart={preConnectStart}
        onDrag={preConnectDrag}
        onStop={connectStop}
      >
        <circle 
          cx={x + width - 10} 
          cy={y + 15 } 
          r={10} 
          fill='transparent' 
          stroke='transparent' 
          style={{cursor: 'crosshair'}} />
      </DraggableCore>

      <DraggableCore
        onDrag={preResizeFn} >
      <rect
        fill='transparent'
        stroke='transparent'
        x={x + width - 5}
        y={y}
        width={5}
        height={30}
        style={{cursor: 'ew-resize'}} />
    </DraggableCore>
      <DraggableCore
        onDrag={preMoveDrag}>
      <rect 
        x={x} 
        y={y} 
        fill='transparent'
        stroke='transparent' 
        width={width-20} 
        height={30} 
        style={{cursor: 'move'}} />
      </DraggableCore>

  </g>
  )
}

