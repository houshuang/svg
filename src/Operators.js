import React from "react";
import Social from './graphic/people'
import { connect } from './store'

// export default ({ x, y, onOver, onLeave, onClick, selected, highlighted }) => {
export default connect(({ store: { mode, operators, socialCoords, socialCoordsScaled }, scaled }) => {
  let ops, dragOp
  ops = operators.map(op => {
    const coords = scaled ? op.coordsScaled : op.coords
    return ( <Social 
      key={op.id} 
      x={coords[0]}
      y={coords[1]}
      onLeave={op.onLeave} 
      onOver={op.onOver} 
      onClick={op.onClick} 
      selected={op.selected} 
      highlighted={op.highlighted} 
      startDragging={op.startDragging}
      onDrag={op.onDrag}
      onStop={op.stopDragging}
    /> 
  )
  })
  if(mode === 'placingSocial') {
    const coords = scaled ? socialCoordsScaled : socialCoords
    dragOp = <Social x={coords[0]} y={coords[1]} />
  } else {
    dragOp = null
  }

  return (
    <g>
    { ops }
    { dragOp }
  </g>
  )
})

    // stroke={selected ? "#ff9900" : "grey"}
    // fill={highlighted ? "yellow" : "white"}
