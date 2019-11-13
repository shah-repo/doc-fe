import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType";
import { canEditDocumentRevision } from "../../document.revision/utils/helpers";
import { FBDocumentRevisionMode } from "../types/store";
import FBStore from "./FBStore";

export class FBDocumentRevisionStore {
  @observable public mode: FBDocumentRevisionMode = "none";

  @computed public get isOutput(): boolean {
    return this.mode === "outputCreate" || this.mode === "outputPreview";
  }

  @action public setInitialFBMode = (group: DocumentGroupType) => {
    const docRevMode = group === "FORM" ? "create" : "none";
    this.setMode(docRevMode);
  }

  @action public setValues = (values: DocumentRevision) => {
    const fmGroup = _.get(values, "document.documentType.group");
    const outputGroup = _.get(values, "formDocument.document.docId");

    switch (true) {
      // TEMPLATE FORM
      case fmGroup && fmGroup === "FORM":
        return this.fmConfig(values);
      // OUTPUT FORM
      case outputGroup !== undefined:
        return this.outputConfig(values);
      default:
        return this.setMode("none");
    }
  }

  @action public setMode = (mode: FBDocumentRevisionMode) => {
    this.mode = mode;
    switch (mode) {
      case "none":
        return FBStore.setMode("none");
      case "create":
      case "update":
        return FBStore.setMode("design");
      case "preview":
      case "outputPreview":
        return FBStore.setMode("preview");
      case "outputCreate":
        return FBStore.setMode("form");
    }
  }

  @action private outputConfig = (values: DocumentRevision) => {
    const schema = _.get(values, "formDocument.formTemplate.schema") || [];
    const { formInput } = values;

    const canEditOutput =
      values.status === DocumentRevisionStatus.Draft ||
      values.status === DocumentRevisionStatus.PendingChange;

    const docRevMode = canEditOutput ? "outputCreate" : "outputPreview";

    this.setMode(docRevMode);
    FBStore.setSchema(schema);
    FBStore.setValues(formInput as Dictionary<any>);
  }

  @action private fmConfig = (values: DocumentRevision) => {
    const schema = _.get(values, "formTemplate.schema") || [];
    const { formTemplate, formInput } = values;
    let docRevMode: FBDocumentRevisionMode = formTemplate ? "update" : "create";

    if (docRevMode === "update" && !canEditDocumentRevision(values)) {
      docRevMode = "preview";
    }

    this.setMode(docRevMode);
    FBStore.setSchema(schema);
    FBStore.setValues(formInput as Dictionary<any>);
  }
}

const FBDRStore = new FBDocumentRevisionStore();
export default FBDRStore;
