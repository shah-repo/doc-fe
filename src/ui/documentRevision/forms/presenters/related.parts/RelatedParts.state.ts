import { get, set } from "lodash";
import { action, observable } from "mobx";
import { ListItemEdited, ListItemUpdateData, RelatedPartsListItem } from "../../../../../state/ducks/relatedParts/types";
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
  @observable listItemBeingEdited: ListItemEdited = {
    docRevId: "",
  };

  @action setRelatedPartsList(list: RelatedPartsListItem[]) {
    this.relatedPartsList = list;
  }

  @action updateRelatedPartsList(docRevId: string, data: ListItemUpdateData) {
    this.relatedPartsList = this.relatedPartsList.map(
      (item) => {
        if (item.documentRevisionId === docRevId) {
          return { ...item, ...data };
        }
        return item;
      }
    );
    this.clearListItemBeingEdited();
  }

  @action filterRelatedPartsList(docRevId: string) {
    this.relatedPartsList = this.relatedPartsList.filter((item) => item.documentRevisionId !== docRevId);
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

  @action validateDocId(parentPartDocId, userEnteredDocIdPortion, skipId = "") {
    this.docIdErrorMsg = "";

    if (!userEnteredDocIdPortion) {
      this.docIdErrorMsg = "relatedParts.docId.required.msg";

    } else if (userEnteredDocIdPortion.length === 1) {
      this.docIdErrorMsg = "relatedParts.docId.length.msg";

    } else if (/\D/.test(userEnteredDocIdPortion)) {
      this.docIdErrorMsg = "relatedParts.docId.onlyNumbers.msg";

    } else {
      const filteredList = this.relatedPartsList.filter(
        (listItem: RelatedPartsListItem) =>
          listItem.rootDocId === `${parentPartDocId}-${userEnteredDocIdPortion}` && userEnteredDocIdPortion !== skipId);

      if (filteredList.length > 0) {
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

  @action setListItemBeingEdited(listItem: RelatedPartsListItem) {
    this.listItemBeingEdited = {
      docRevId: listItem.documentRevisionId,
      docId: listItem.suffixNumber as unknown as string,
      name: listItem.suffixName,
      version: listItem.version,
    };
  }

  @action clearListItemBeingEdited() {
    this.listItemBeingEdited = {
      docRevId: "",
    };
  }
}

export default RelatedPartsState;
