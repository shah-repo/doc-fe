import _ from "lodash";
import { action, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
import FBRequest from "../FBApi/FBApi.request";
import { FBDocumentRevisionItem, FBDocumentRevisions } from "./FBDocumentRevisions.types";

export class FBDocumentRevisionsState extends FBRequest<FBDocumentRevisions, null> {
  @observable public name = "";
  @observable public documentRevisions?: FBDocumentRevisionItem[] = [];

  public constructor(data?: FBDocumentRevisionItem[]) {
    super();
    this.setDocumentRevisions(data || []);
  }

  @action public setDocumentRevisions = (items?: FBDocumentRevisionItem[]) => {
    set(this, "documentRevisions", items);
  };

  public addDocRevItem = (item: FBDocumentRevisionItem) => {
    item = {
      ...item,
      id: generateUuid(),
    };
    const documentRevisions = _.union(this.documentRevisions || [], [item]);
    this.setDocumentRevisions(documentRevisions);
  };

  public removeDocRevItem = (index: number) => {
    const documentRevisions = this.documentRevisions?.splice(index, 1);
    this.setDocumentRevisions(documentRevisions);
  };
}

export default FBDocumentRevisionsState;
