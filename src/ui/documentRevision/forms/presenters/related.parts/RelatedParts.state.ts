import { get } from "lodash";
import { action, observable } from "mobx";
import { createContext, useContext } from "react";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { RelatedPartsListItem } from "../../../../../state/ducks/relatedParts/types";

export class RelatedPartsStore {
  @observable relatedPartsList: RelatedPartsListItem[] = [];

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

  @action addNewRelatedPart(createdDocumentRevision) {
    const newRelatedPart = {
      documentId: get(createdDocumentRevision, "documentId"),
      rootDocId: get(createdDocumentRevision, "document.docId"),
      name: get(createdDocumentRevision, "name"),
      documentRevisionId: get(createdDocumentRevision, "id"),
      status: get(createdDocumentRevision, "displayStatus"),
    };

    this.relatedPartsList.push(newRelatedPart);
  }
}


export const relatedPartsStore = {
  relatedPartsStore: new RelatedPartsStore(),
};

export const RelatedPartsStoreContext = createContext(relatedPartsStore);
export const useRelatedPartsStore = () => useContext(RelatedPartsStoreContext);
