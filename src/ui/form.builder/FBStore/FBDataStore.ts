import { observable } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;
}

export default new FBDataStore();
