import { action, computed, observable, set } from "mobx";

class FBSortableState {
  @observable public draggedIndex: number | null = null;

  @action public setDraggedIndex(index: number | null) {
    set(this, "draggedIndex", index);
  }

  @computed get isDragPerfomed() {
    return this.draggedIndex !== null;
  }
}

export default FBSortableState;
