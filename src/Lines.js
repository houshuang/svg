import React from 'react'
import { observer } from 'mobx-react'
import { connect } from './store'

export const Line = observer(({ connection, scaled }) =>
  <path
    d={scaled ? connection.pathScaled : connection.path}
    fill='transparent'
    stroke='grey'
    strokeWidth='2' />
)

export const DragLine = connect(({ store: { dragPath, mode }}) => {
  if(mode !== 'dragging') { return null }
  return (
    <path
      d={dragPath}
    fill='transparent'
    stroke='grey'
    strokeWidth='2' />
  )
})

export default connect(({store: { connections }, scaled} ) =>
  <g>
    { connections.map(connection => <Line scaled={scaled} key={connection.id} connection={connection} />) }
  </g>
)
