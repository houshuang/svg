// @flow
import { computed, action, observable } from "mobx";

import { initialConnections, initialActivities } from "../data";

import { drawPath } from "../path";
import Activity from "./activity";
import Connection from "./connection";
import { between } from "../utils";
import getOffsets from "../utils/getOffsets";

const getid = (ary, id) => {
  const res = ary.filter(x => x.id === id);
  return res && res[0];
};

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
const calculateBounds = (activity, activities) => {
  const sorted = activities
    .filter(x => x.id !== activity.id)
    .sort((a, b) => a.x - b.x);
  const leftbound = sorted.filter(act => act.x <= activity.x).pop();
  const rightbound = sorted
    .filter(act => act.x >= activity.x + activity.width)
    .shift();
  return [ leftbound, rightbound ];
};

export default class Store {
  constructor() {
    this.addHistory();
  }

  @observable connections = initialConnections.map(
    x => new Connection(getid(this.activities, x[0]), getid(this.activities, x[1]))
  );
  @action addConnection = (from, to) => this.connections.push([ from, to ]);

  @observable activities = initialActivities.map(x => new Activity(...x));

  @observable history = [];

  @action addHistory = () => {
    this.history.push([
      this.connections.map(x => ({ ...x })),
      this.activities.map(x => ({ ...x }))
    ]);
  };

  @computed get canUndo() {
    return this.history.length > 0;
  }

  @action undo = () => {
    const [ connections, activities ] = this.history.length > 1
      ? this.history.pop()
      : this.history[0];
    this.activities = activities.map(
      x => new Activity(x.plane, x.x, x.title, x.width, x.id)
    );
    this.connections = connections.map(
      x =>
        new Connection(
          getid(this.activities, x.source.id),
          getid(this.activities, x.target.id)
        )
    );
  };

  @observable overlapAllowed = false;
  @action updateSettings = settings => this.overlapAllowed = settings.overlapAllowed;
  @observable currentlyOver;

  @observable mode = "";
  @observable draggingFromA;
  @observable draggingFromActivity;
  @observable dragCoords;

  // user begins dragging a line to make a connection
  @action startDragging = activity => {
    this.mode = "dragging";
    const coords = [
      activity.x * this.scale + activity.width * this.scale - 10,
      activity.y + 15
    ];
    this.draggingFrom = [ ...coords ];
    this.draggingFromActivity = activity;
    this.dragCoords = [ ...coords ];
  };
  @action deleteSelected = () => {
    const conn = this.connections.length;
    const act = this.activities.length;
    const delActivity = this.activities.filter(x => x.selected);
    if (delActivity.length > 0) {
      const delAct = this.activities.filter(x => x.selected)[0];
      this.connections = this.connections.filter(
        x => x.target.id !== delAct.id && x.source.id !== delAct.id
      );
    }
    this.connections = this.connections.filter(x => !x.selected);
    this.activities = this.activities.filter(x => !x.selected);
    if (conn !== this.connections.length || act !== this.activities.length) {
      this.addHistory();
    }
  };

  @action cancelAll = () => {
    this.renameOpen = null;
  };

  @action unselect = () => {
    this.connections.map(x => x.selected = false);
    this.activities.map(x => x.selected = false);
  };

  @action dragging = (deltax: number, deltay: number): void =>
    this.dragCoords = [
      this.dragCoords[0] + deltax,
      this.dragCoords[1] + deltay
    ];
  @computed get dragPath() {
    return this.mode === "dragging"
      ? drawPath(...this.draggingFrom, ...this.dragCoords)
      : null;
  }
  @action swapActivities = (left, right) => {
    right.x = left.x;
    left.x = right.x + right.width;
    this.addHistory();
  };
  @action stopDragging = () => {
    this.mode = "";
    const targetAry = this.activities.filter(x => x.over);
    if (
      targetAry.length > 0 && this.draggingFromActivity.id !== targetAry[0].id
    ) {
      this.connections.push(new Connection(
        this.draggingFromActivity,
        targetAry[0]
      ));
      this.addHistory();
    }
    this.cancelScroll();
  };
  @action setScale = x => {
    const oldscale = this.scale;
    this.scale = between(0.4, 3, x);

    const oldPanBoxSize = 250 / oldscale;
    const newPanBoxSize = 250 / this.scale;
    const needPanDelta = oldPanBoxSize / 2 - newPanBoxSize / 2;

    this.panDelta(needPanDelta);
  };

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = null;
    this.cancelScroll();
    this.draggingFrom = [];
    this.dragCoords = [];
  };
  @observable scrollIntervalID;
  @action storeInterval = interval => {
    this.scrollIntervalID = interval;
  };
  @action cancelScroll = () => {
    window.clearInterval(this.scrollIntervalID);
    this.scrollIntervalID = false;
  };

  @observable currentActivity;
  @observable leftbound;
  @observable rightbound;
  @observable renameOpen;
  @action rename(newTitle) {
    this.renameOpen.title = newTitle;
    this.renameOpen = null;
    this.addHistory();
  }

  @action startResizing = activity => {
    this.mode = "resizing";
    this.currentActivity = activity;
    this.rightbound = calculateBounds(activity, this.activities)[1];
  };
  @action startMoving = activity => {
    this.mode = "moving";
    this.currentActivity = activity;
    let [ leftbound, rightbound ] = calculateBounds(activity, this.activities);
    this.leftbound = leftbound;
    this.rightbound = rightbound;
    this.currentActivity.overdrag = 0;
  };

  @action stopMoving = () => {
    this.mode = "";
    this.addHistory();
    this.cancelScroll();
  };
  @action stopResizing = () => {
    this.mode = "";
    this.addHistory();
    this.cancelScroll();
  };

  @computed get scrollEnabled() {
    return !![ "dragging", "moving", "resizing" ].includes(this.mode);
  }

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta, ydelta) => this.dragCoords = [ xdelta, ydelta ];
  @computed get activityOffsets() {
    const activities = this.activities;
    return [ 1, 2, 3 ].reduce(
      (acc, plane) => ({ ...acc, ...getOffsets(plane, activities) }),
      {}
    );
  }
  @observable scale = 1;

  @observable panx = 0;
  @action addActivity = (plane, rawX) => {
    const x = (rawX - 150) / this.scale + this.panx * 4;
    const newActivity = new Activity(plane, x, "Unnamed", 150);
    this.activities.push(newActivity);
    this.renameOpen = newActivity;
  };

  @action panDelta = deltaX => {
    const oldpan = this.panx;
    const panBoxSize = 250 / this.scale;
    const rightBoundary = 1000 - panBoxSize;

    const newPan = this.panx + deltaX;
    this.panx = between(0, rightBoundary, newPan);

    if (oldpan !== this.panx) {
      if (this.mode === "dragging") {
        this.dragCoords[0] += deltaX * 4 * this.scale;
      }
      if (this.mode === "resizing") {
        const oldwidth = this.currentActivity.width;
        this.currentActivity.resize(deltaX * 4 * this.scale);
        if (oldwidth === this.currentActivity.width) {
          this.panx = oldpan;
        }
      }
      if (this.mode === "moving") {
        const oldx = this.currentActivity.x;
        this.currentActivity.move(deltaX * 4 * this.scale);
        if (oldx === this.currentActivity.x) {
          this.panx = oldpan;
        }
      }
    }
  };

  @computed get panOffset() {
    return this.panx * 4 * this.scale;
  }
}
