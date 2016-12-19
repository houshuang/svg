import React from 'react'
import { DraggableCore } from 'react-draggable'
import { connect } from './store'

const Activity = connect(({ store: { activityOffsets, startDragging, stopDragging, dragging, mode,
  draggingFromActivity, startMoving, stopMoving, startResizing, stopResizing }, activity}) => {
  const { x, y, width, title, move, resize, onOver, onLeave, over } = activity
  return (
    // record that mouse moves over box, for linking/highlighting
    <g
      onMouseOver={onOver}
      onMouseLeave={onLeave} >
      <rect
        x={x}
        y={y}
        fill={over && draggingFromActivity !== activity && mode === 'dragging' ? 'yellow' : 'white'}
        stroke='grey'
        rx={10}
        width={width}
        height={30} />
      <svg style={{overflow: 'hidden'}} width={width + x - 20}>
        <text
          x={x + 3}
          y={y + 20} >
          {title}
        </text>
      </svg>
      <circle
        cx={x + width - 10}
        cy={y + 15 }
        r={5}
        fill='transparent'
        stroke='black'
      />

    <DraggableCore
      onStart={() => startDragging(activity)}
      onDrag={(_, {deltaX, deltaY}) => dragging(deltaX, deltaY)}
      onStop={stopDragging} >
        <circle
          cx={x + width - 10}
          cy={y + 15 }
          r={10}
          fill='transparent'
          stroke='transparent'
          style={{cursor: 'crosshair'}} />
      </DraggableCore>

      // resize box (x axis)
      <DraggableCore
        onStart={() => startResizing(activity)}
        onDrag={(_, {deltaX}) => resize(deltaX)}
        onStop={stopResizing}>
      <rect
        fill='transparent'
        stroke='transparent'
        x={x + width - 5}
        y={y}
        width={5}
        height={30}
        style={{cursor: 'ew-resize'}} />
    </DraggableCore>

    // moving the whole box
    <DraggableCore
      onStart={() => startMoving(activity)}
      onDrag={(_, {deltaX}) => move(deltaX)}
      onStop={stopMoving}>
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
