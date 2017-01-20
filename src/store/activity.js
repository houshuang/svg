// @flow

import { observable, computed, action } from "mobx";
import { store } from "./index";
import cuid from "cuid";
import { between } from "../utils";

export default class Activity {
  @action init = (plane: number, x: number, title: string, width: number, id: string) => {
    this.id = id || cuid();
    this.over = false;
    // whether mouse is highlighting this activity
    this.overdrag = 0;
    this.plane = plane;
    this.title = title || "";
    this.width = width;
    this.x = x;
  };

  constructor(plane: number, x: number, title: string, width: number, id: string) {
    this.init(plane, x, title, width, id);
  }

  plane: number;
  id: string;
  @observable over: boolean;
  @observable overdrag: number;
  @observable selected: boolean;
  @observable title: string;
  @observable width: number;
  @observable x: number;

  @action
  select = () => {
    store.unselect();
    this.selected = true;
  };

  @action rename = (newname: string) => {
    this.title = newname;
    store.cancelAll();
  };

  @action move = (deltax: number) => {
    if (store.mode !== "moving") {
      return;
    }
    if (store.overlapAllowed) {
      this.x = between(0, 4000 - this.width, this.x + deltax / store.scale);
    } else {
      const oldx = this.x;
      this.x = between(
        store.leftbound && store.leftbound.x + store.leftbound.width,
        store.rightbound ? store.rightbound.x - this.width : 4000 - this.width,
        this.x + deltax / store.scale
      );
      if (oldx === this.x && Math.abs(deltax) !== 0) {
        this.overdrag += deltax;
        if (this.overdrag < -100) {
          store.swapActivities(store.leftbound, this);
          store.stopMoving();
        }
        if (this.overdrag > 100) {
          store.swapActivities(this, store.rightbound);
          this.overdrag = 0;
          store.stopMoving();
        }
      }
    }
  };

  @action resize = (deltax: number) => {
    const rightbound = (store.rightbound && store.rightbound.x) || 4000;
    this.width = between(
      20,
      rightbound - this.x,
      this.width + deltax / store.scale
    );
    store.mode = "resizing";
  };

  @action onOver = () => this.over = true;
  @action onLeave = () => this.over = false;
  @action setRename = () => store.renameOpen = this;
  @computed get highlighted(): boolean {
    return this.over &&
      store.draggingFromActivity !== this &&
      store.mode === "dragging";
  }

  @computed get y(): number {
    const offset = store.activityOffsets[this.id];
    return this.plane * 100 + 50 - offset * 30;
  }
}
