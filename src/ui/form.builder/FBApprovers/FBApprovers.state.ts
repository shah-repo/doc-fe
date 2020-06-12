import _ from "lodash";
import { action, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
import FBRequest from "../FBApi/FBApi.request";
import { DocumentRevisionItem, DocumentRevisions } from "./FBApprovers.types";

export class FBApproversState extends FBRequest<DocumentRevisions, null> {
  @observable public name = "";
  @observable public documentRevisions?: DocumentRevisionItem[] = [];

  public constructor(data?: DocumentRevisions) {
    super();
    this.setDocumentRevisions(data?.documentRevisions || []);
  }

  @action public setDocumentRevisions = (items?: DocumentRevisionItem[]) => {
    set(this, "documentRevisions", items);
  };

  @action public addDocRevItem = (item: DocumentRevisionItem) => {
    item = {
      ...item,
      id: generateUuid(),
    };
    const documentRevisions = _.union(this.documentRevisions || [], [item]);
    this.setDocumentRevisions(documentRevisions);
  };

  @action public removeDocRevItem = (index: number) => {
    const documentRevisions = this.documentRevisions?.splice(index, 1);
    this.setDocumentRevisions(documentRevisions);
  };
}

export default FBApproversState;
