import { union } from "lodash";
import { action, observable, set } from "mobx";
import { FB, FBDocumentRevisionsValue } from "..";

export class FBDocumentRevisionsState {
  @observable public value?: FBDocumentRevisionsValue[];

  public constructor(formValue?: FBDocumentRevisionsValue[]) {
    this.value = formValue;
  }

  @action public setDocumentRevisions = (value?: FBDocumentRevisionsValue[]) =>
    set(this, "value", value);

  @action public addDocumentRevision = (item: FBDocumentRevisionsValue) => {
    const itemWithId = {
      ...item,
      id: FB.uniqid,
    };
    this.setDocumentRevisions(union(this.value || [], [itemWithId]));
  };
}

export default FBDocumentRevisionsState;
