import React from 'react'
import Lines, { DragLine } from './Lines'
import Activities from './Activities'
import { LevelLines, PanMap } from './fixed_components'
import ScrollFields from './ScrollFields'
import DragGuides from './DragGuides'
import { connect, store } from './store'

const scrollMouse = (e) => {
  e.preventDefault()
  store.panDelta(e.deltaY)
}

export default connect(({ store: { scrollEnabled }, width, height, hasPanMap, viewBox, scaleFactor = 1 }) => 
  <svg 
    width={width} 
    height={height} 
    onWheel={scrollMouse}>

    <svg viewBox={viewBox} >
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
      { !hasPanMap && scrollEnabled && <DragLine /> }
      <DragGuides />
      <Activities />
    </svg>
    { !!hasPanMap &&  <PanMap scaleFactor={scaleFactor} />}
    { !hasPanMap && scrollEnabled && <ScrollFields width={width} height={height} /> }
      </svg>
)
