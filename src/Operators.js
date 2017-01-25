import React from "react";
import Social from './graphic/people'
import { connect } from './store'

export default connect(({ store: { mode, operators, socialCoords, socialCoordsScaled }, scaled }) => {
  let ops, dragOp
  if(scaled) {
    ops = operators.map(op => <Social key={op.id} x={op.coordsScaled[0]} y={op.coordsScaled[1]} />)
  } else {
    ops = operators.map(op => <Social key={op.id} x={op.coords[0]} y={op.coords[1]} />)
  }
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
