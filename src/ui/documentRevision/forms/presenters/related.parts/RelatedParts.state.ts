import { get, set } from "lodash";
import { action, observable } from "mobx";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { RelatedPartsListItem } from "../../../../../state/ducks/relatedParts/types";
import { Translation } from "../../../../translations/types";

class RelatedPartsState {

  constructor() {
    this.setViewOnlyMode(true);
    this.setLoadingState(false);
  }

  @observable relatedPartsList: RelatedPartsListItem[] = [];
  @observable viewOnlyMode = false;
  @observable loadingState = false;
  @observable docIdErrorMsg: string | Translation = "";

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


  @action showParticularDocs = (docType) => {
    const originalList: RelatedPartsListItem[]  = [...this.relatedPartsList]; // make a copy of the original list
    console.log("docType", docType);
    return docType === "Active" ? this.relatedPartsList.filter((item) => item.status !== DocumentRevisionStatus.Voided)
      : originalList; // return the original list if docType is "All"
  };

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

  @action validateDocId(parentPartDocId, userEnteredDocIdPortion) {
    this.docIdErrorMsg = "";

    if (!userEnteredDocIdPortion) {
      this.docIdErrorMsg = "relatedParts.docId.required.msg";

    } else if (userEnteredDocIdPortion.length === 1) {
      this.docIdErrorMsg = "relatedParts.docId.length.msg";

    } else if (/\D/.test(userEnteredDocIdPortion)) {
      this.docIdErrorMsg = "relatedParts.docId.onlyNumbers.msg";

    } else {
      const docIdExists = this.relatedPartsList.filter(
        (listItem: RelatedPartsListItem) => listItem.rootDocId === `${parentPartDocId}-${userEnteredDocIdPortion}`)
        .length > 0;
      if (docIdExists) {
        this.docIdErrorMsg = "relatedParts.docId.exists.msg";
      }
    }

    return !this.docIdErrorMsg;
  }

  @action setViewOnlyMode(viewOnly) {
    set(this, "viewOnlyMode", viewOnly);
  }

  @action setLoadingState(isVisible = false) {
    set(this, "loadingState", isVisible);
  }
}

export default RelatedPartsState;
