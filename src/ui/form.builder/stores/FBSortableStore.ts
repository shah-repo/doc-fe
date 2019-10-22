import { action, observable } from "mobx";
import { FBSortableType } from "../types/sortable";

export class FBSortableStore {
  @observable public mode: FBSortableType = "inactive";

  @action public setMode = (type: FBSortableType) => {
    this.mode = type;
  }
}

const sortableStore = new FBSortableStore();
export default sortableStore;
