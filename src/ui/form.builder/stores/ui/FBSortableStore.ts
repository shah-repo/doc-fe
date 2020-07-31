import { action, computed, observable } from "mobx";
import { FBSortableType } from "../../types/sortable";
import FBStore from "./FBStore";

export class FBSortableStore {
  @observable public mode: FBSortableType = "inactive";

  @action public setMode = (type: FBSortableType) => {
    this.mode = type;
  };

  @computed get isSortable() {
    return FBStore.mode !== "form";
  }
}

const sortableStore = new FBSortableStore();
export default sortableStore;
