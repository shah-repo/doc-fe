import { filter, union } from "lodash";
import { action, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
import { FBDocumentRevisionItem } from "./FBDocumentRevisions.types";

export class FBDocumentRevisionsState {
  @observable public name = "";
  @observable public documentRevisions?: FBDocumentRevisionItem[] = [];

  public constructor(data?: FBDocumentRevisionItem[]) {
    this.documentRevisions = data || [];
  }

  @action public setDocumentRevisions = (items?: FBDocumentRevisionItem[]) => {
    set(this, "documentRevisions", items);
  };

  public addDocRevItem = (item: FBDocumentRevisionItem) => {
    item = {
      ...item,
      id: generateUuid(),
    };
    const documentRevisions = union(this.documentRevisions || [], [item]);
    this.setDocumentRevisions(documentRevisions);
  };

  public removeDocRevItem = (id: string) => {
    const documentRevisions = filter(this.documentRevisions, (doc) => doc.proposedDocumentRevision.id !== id);
    this.setDocumentRevisions(documentRevisions);
  };
}

export default FBDocumentRevisionsState;
