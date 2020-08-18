import { union } from "lodash";
import { action, observable, set } from "mobx";
import { FBDocumentRevisionsValue } from "..";

export class FBDocumentRevisionsState {
  @observable public value?: FBDocumentRevisionsValue[];

  public constructor(formValue?: FBDocumentRevisionsValue[]) {
    this.value = formValue;
  }

  @action public setDocumentRevisions = (value?: FBDocumentRevisionsValue[]) =>
    set(this, "value", value);

  @action public addDocumentRevision = (item: FBDocumentRevisionsValue) =>
    this.setDocumentRevisions(union(this.value || [], [item]));
}

export default FBDocumentRevisionsState;
