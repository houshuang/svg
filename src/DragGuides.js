import React from "react";
import { connect } from "./store";

const formatTime = (pixels, scale) =>
  (pixels / (3900 * scale / 120)).toFixed(0) + " min.";

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

const DragGuide = connect(({ store: { scale }, ...rest }) => {
  const x = rest.x * scale;
  const current = rest.current * scale;
  const middle = (x - current) / 2.0 + current - 5;
  const timeText = formatTime(Math.abs(x - current), scale);

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
          x={rightbound.x}
          current={currentActivity.x + currentActivity.width}
        />
        : null;
    }
    // below is quite ugly - maybe move calculations to store? idea is to not render bars anymore if the overlap is allowed, and
    // the activity has already moved past the boundary of the adjacent activity
    if (mode === "moving") {
      return (
        <g>
          {
            leftbound && leftbound.x + leftbound.width < currentActivity.x
              ? leftbound
                ? <DragGuide
                  x={leftbound.x + leftbound.width}
                  current={currentActivity.x}
                />
                : <DragGuide x={0} current={currentActivity.x} />
              : null
          }
          {
            rightbound &&
              rightbound.x > currentActivity.x + currentActivity.width
              ? rightbound
                ? <DragGuide
                  x={rightbound.x}
                  current={currentActivity.x + currentActivity.width}
                />
                : <DragGuide
                  x={4000}
                  current={currentActivity.x + currentActivity.width}
                />
              : null
          }
        </g>
      );
    }
    return null;
  });
