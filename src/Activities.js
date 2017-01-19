import React from "react";
import { DraggableCore } from "react-draggable";
import { connect } from "./store";

const Activity = connect((
  {
    store: {
      startDragging,
      stopDragging,
      dragging,
      mode,
      draggingFromActivity,
      scale,
      startMoving,
      stopMoving,
      startResizing,
      stopResizing
    },
    activity,
    scaled
  }
) =>
  {
    const {
      y,
      selected,
      select,
      title,
      move,
      resize,
      onOver,
      onLeave,
      setRename,
      over
    } = activity;
    let x, width;
    if (scaled) {
      x = activity.x * scale;
      width = activity.width * scale;
    } else {
      x = activity.x;
      width = activity.width;
    }

    return (
      <g
        onMouseOver={onOver}
        onMouseLeave={onLeave}
        onDoubleClick={setRename}
        onClick={select}
      >
        <rect
          x={x}
          y={y}
          stroke={selected ? "#ff9900" : "grey"}
          fill={
            over && draggingFromActivity !== activity && mode === "dragging"
              ? "yellow"
              : "white"
          }
          rx={10}
          width={width}
          height={30}
        />
        <svg style={{ overflow: "hidden" }} width={width + x - 20}>
          <text x={x + 3} y={y + 20}>
            {title}
          </text>
        </svg>
        <circle
          cx={x + width - 10}
          cy={y + 15}
          r={5}
          fill="transparent"
          stroke="black"
        />
        <DraggableCore
          onStart={() => startDragging(activity)}
          onDrag={(_, { deltaX, deltaY }) => dragging(deltaX, deltaY)}
          onStop={stopDragging}
        >
          <circle
            cx={x + width - 10}
            cy={y + 15}
            r={10}
            fill="transparent"
            stroke="transparent"
            style={{ cursor: "crosshair" }}
          />
        </DraggableCore>
        // resize box (x axis)
        <DraggableCore
          onStart={() => startResizing(activity)}
          onDrag={(_, { deltaX }) => resize(deltaX)}
          onStop={stopResizing}
        >
          <rect
            fill="transparent"
            stroke="transparent"
            x={x + width - 5}
            y={y}
            width={5}
            height={30}
            style={{ cursor: "ew-resize" }}
          />
        </DraggableCore>
        // moving the whole box
        <DraggableCore
          onStart={() => startMoving(activity)}
          onDrag={(_, { deltaX }) => move(deltaX)}
          onStop={stopMoving}
        >
          <rect
            x={x}
            y={y}
            fill="transparent"
            stroke="transparent"
            width={width - 20}
            height={30}
            style={{ cursor: "move" }}
          />
        </DraggableCore>
      </g>
    );
  });

export default connect(({ store: { activities }, scaled }) => (
  <g>
    {activities.map(x => <Activity activity={x} scaled={scaled} key={x.id} />)}
  </g>
));

