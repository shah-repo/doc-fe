import _ from "lodash";
import { action, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
import FBRequest from "../FBApi/FBApi.request";
import { DocumentRevisionItem, DocumentRevisions } from "./FBDocumentRevisions.types";

export class FBDocumentRevisionsState extends FBRequest<DocumentRevisions, null> {
  @observable public name = "";
  @observable public documentRevisions?: DocumentRevisionItem[] = [];

  public constructor(data?: DocumentRevisionItem[]) {
    super();
    this.setDocumentRevisions(data || []);
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

export default FBDocumentRevisionsState;
