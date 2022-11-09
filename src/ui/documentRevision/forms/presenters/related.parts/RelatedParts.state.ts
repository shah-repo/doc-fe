import { get } from "lodash";
import { action, observable } from "mobx";
import { createContext, useContext } from "react";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { RelatedPartsListItem } from "../../../../../state/ducks/relatedParts/types";

class RelatedPartsStore {
  @observable relatedPartsList: RelatedPartsListItem[] = [];
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
    const idExists = this.relatedPartsList.filter(
      (listItem: RelatedPartsListItem) => listItem.rootDocId === docId).length > 0;

    this.docIdExists = idExists;
  }
}


export const relatedPartsStore = {
  relatedPartsStore: new RelatedPartsStore(),
};

export const RelatedPartsStoreContext = createContext(relatedPartsStore);
export const useRelatedPartsStore = () => useContext(RelatedPartsStoreContext);
