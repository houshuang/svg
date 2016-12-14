import React from 'react'
import Lines, { DragLine } from './Lines'
import Activities from './Activities'
import { LevelLines, PanMap } from './fixed_components'

export default ({ width, height, hasPanMap, viewBox, scaleFactor = 1 }) => 
  <svg width={width} height={height} >
    <svg viewBox={viewBox}>
      <rect 
        x={0} 
        y={0} 
        fill='#fcf9e9' 
        stroke='transparent' 
        rx={10 * scaleFactor} 
        width={width * Math.max(4, scaleFactor)} 
        height={height * scaleFactor} />
      <LevelLines />
      <Lines />
      { !hasPanMap && <DragLine /> }
      <Activities />
    </svg>
    { !!hasPanMap && <PanMap scaleFactor={scaleFactor} /> }
  </svg>
