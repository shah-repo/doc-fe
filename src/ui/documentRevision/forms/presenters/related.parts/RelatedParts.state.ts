import { get, set } from "lodash";
import { action, observable } from "mobx";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { RelatedPartsListItem } from "../../../../../state/ducks/relatedParts/types";

class RelatedPartsState {

  constructor() {
    this.setAddActionVisible(true);
    this.setLoadingState(false);
  }

  @observable relatedPartsList: RelatedPartsListItem[] = [];
  @observable addActionVisible = true;
  @observable loadingState = false;
  @observable docIdExists = false;

  @action setRelatedPartsList(list: RelatedPartsListItem[]) {
    this.relatedPartsList = list;
  }

  @action updateRelatedPartsList(docRevId: string, name: string) {
    this.relatedPartsList = this.relatedPartsList.map(
      (item) => {
        if (item.documentRevisionId === docRevId) {
          item.status = DocumentRevisionStatus.Voided;
          item.name = name;
        }
        return item;
      }
    );
  }

  @action addNewRelatedPart(createdDocumentRevision, suffixName) {
    const newRelatedPart = {
      documentId: get(createdDocumentRevision, "documentId"),
      rootDocId: get(createdDocumentRevision, "document.docId"),
      name: get(createdDocumentRevision, "name"),
      documentRevisionId: get(createdDocumentRevision, "id"),
      status: get(createdDocumentRevision, "displayStatus"),
      suffixName,
    };

    this.relatedPartsList.push(newRelatedPart);
  }

  @action checkForDuplicateDocIds(docId) {
    this.docIdExists = this.relatedPartsList.filter(
      (listItem: RelatedPartsListItem) => listItem.rootDocId === docId).length > 0;
  }

  @action setAddActionVisible(isVisible = true) {
    set(this, "addActionVisible", isVisible);
  }

  @action setLoadingState(isVisible = false) {
    set(this, "loadingState", isVisible);
  }
}

export default RelatedPartsState;

// export const relatedPartsStore = {
//   relatedPartsStore: new RelatedPartsStore(),
// };

// export const RelatedPartsStoreContext = createContext(relatedPartsStore);
// export const useRelatedPartsStore = () => useContext(RelatedPartsStoreContext);
