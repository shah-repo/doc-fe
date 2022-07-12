import { action, observable, set } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;

  @action public setRefreshData = (value) => {
    set(this, "refreshData", value);
  };
}

export default new FBDataStore();
