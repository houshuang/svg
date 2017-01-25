import React from "react";
import { connect } from "./store";
import { between, timeToPx, pxToTime } from './utils'

const TwoSidedArrow = ({ x }) => (
  <polygon
    x={x}
    y={300}
    points="492.426,246.213 406.213,160 406.213,231.213 86.213,231.213 86.213,
      160 0,246.213 86.213,332.427 86.213,261.213 406.213,261.213 406.213,332.427"
    transform={`translate(${x - 17} 300) scale(0.1) `}
  />
);

const VerticalLine = ({ x }) => (
  <line
    x1={x}
    y1={0}
    x2={x}
    y2={600}
    stroke="grey"
    strokeWidth={1}
    strokeDasharray="5,5"
  />
);

const ShadedBox = ({ x, current }) => (
  <rect
    stroke="transparent"
    fill="#f9f3d2"
    fillOpacity={0.3}
    x={Math.min(current, x)}
    y={0}
    width={Math.abs(x - current)}
    height={600}
  />
);

const DragGuide = connect(({ store: { scale, panTime, rightEdgeTime }, ...rest }) => {
  const x = between(panTime, rightEdgeTime, rest.x)
  const current = between(panTime, rightEdgeTime, rest.current)
  const middle = (x - current) / 2.0 + current - 5;
  const timeText = Math.abs(Math.round(pxToTime(rest.x - rest.current, scale))) + ' min.'

  return (
    <g>
      <text x={middle} y={300}>
        {timeText}
      </text>
      <TwoSidedArrow x={middle} />
      <VerticalLine x={x} />
      <VerticalLine x={current} />
      <ShadedBox x={x} current={current} />
    </g>
  );
});

export default connect((
  { store: { leftbound, rightbound, mode, currentActivity, scale } }
) =>
  {
    if (mode === "resizing") {
      return rightbound
        ? <DragGuide
          x={rightbound.xScaled}
          current={currentActivity.xScaled + currentActivity.widthScaled}
        />
        : null;
    }
    // below is quite ugly - maybe move calculations to store? idea is to not render bars anymore if the overlap is allowed, and
    // the activity has already moved past the boundary of the adjacent activity
    if (mode === "moving") {
      return (
        <g>
          {
            leftbound && leftbound.xScaled + leftbound.widthScaled < currentActivity.xScaled
              ? leftbound
                ? <DragGuide
                  x={leftbound.startTime + leftbound.length}
                  current={currentActivity.startTime}
                />
                : <DragGuide x={0} current={currentActivity.startTime} />
              : null
          }
          {
            rightbound &&
              rightbound.startTime > currentActivity.startTime + currentActivity.length
              ? rightbound
                ? <DragGuide
                  x={rightbound.startTime}
                  current={currentActivity.startTime + currentActivity.length}
                />
                : <DragGuide
                  x={4000}
                  current={currentActivity.startTime + currentActivity.length}
                />
              : null
          }
        </g>
      );
    }
    return null;
  });
