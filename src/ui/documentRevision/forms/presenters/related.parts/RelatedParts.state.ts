import { set } from "lodash";
import { action, computed, observable } from "mobx";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
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

  @observable docType: string | Translation="";

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

  @computed get activeRelatedPartsList() {
    return this.relatedPartsList.filter((part) =>
      ![DocumentRevisionStatus.Voided, DocumentRevisionStatus.Obsolete].includes(part.status)
    );
  }

  @computed get allRelatedPartsList() {
    return this.relatedPartsList;
  }

  @action addNewRelatedPart(createdRelatedPart: RelatedPartsListItem) {
    this.relatedPartsList.push(createdRelatedPart);
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
