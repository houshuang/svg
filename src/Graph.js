import React from 'react'
import Lines, { DragLine } from './Lines'
import Activities from './Activities'
import { LevelLines, PanMap, TimeScale } from './fixed_components'
import ScrollFields from './ScrollFields'
import DragGuides from './DragGuides'
import { connect, store } from './store'

const scrollMouse = (e) => {
  e.preventDefault()
  if(e.shiftKey) {
    store.setScale(store.scale + (e.deltaY * 0.01))
  } else {
    store.panDelta(e.deltaY)
  }
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
        rx={10}
        width={width * 4}
        height={height * 4} />
      <LevelLines />
      <Lines scaled={!hasPanMap}/>
      { !hasPanMap && scrollEnabled && <DragLine /> }
      { !hasPanMap &&
        <g>
        <DragGuides />
        <TimeScale />
        </g>
      }
      <Activities scaled={!hasPanMap} />
    </svg>
    { !!hasPanMap &&  <PanMap />}
    { !hasPanMap && scrollEnabled && <ScrollFields width={width} height={height} /> }
      </svg>
)
