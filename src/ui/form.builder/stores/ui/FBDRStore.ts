import _ from "lodash";
import { action, computed, observable } from "mobx";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupType } from "../../../../state/ducks/documentRevisions/documentType";
import { canEditDocumentRevision } from "../../../document.revision/utils/helpers";
import { DocumentRevisionFormValues } from "../../../documentRevision/forms/types";
import { FBDocumentRevisionMode, FBDRGroupConfig } from "../../types/store";
import FBStore from "./FBStore";

export class FBDocumentRevisionStore {
  @observable public mode: FBDocumentRevisionMode = "none";

  @computed public get isOutput(): boolean {
    return this.mode === "outputCreate" || this.mode === "outputPreview" || this.mode === "outputUpdate";
  }

  @action public setInitialFBMode = (group: DocumentGroupType) => {
    const docRevMode = group === "FORM" ? "create" : "none";
    this.setMode(docRevMode);
  };

  @action public setValues = (values: DocumentRevision | DocumentRevisionFormValues) => {
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
  };

  @action public setMode = (mode: FBDocumentRevisionMode) => {
    this.mode = mode;
    switch (mode) {
      case "create":
      case "update":
        return FBStore.setMode("design");
      case "preview":
      case "outputPreview":
        return FBStore.setMode("preview");
      case "outputCreate":
      case "outputUpdate":
        return FBStore.setMode("form");
      default:
        return FBStore.setMode(mode);
    }
  };

  @action private outputConfig = (values: DocumentRevision | DocumentRevisionFormValues) => {
    const schema = _.get(values, "formDocument.formTemplate.schema") || [];
    const isRevised = (values as DocumentRevisionFormValues).outputRevision;
    const { formInput } = values;

    const editableIn = [
      DocumentRevisionStatus.Draft,
      DocumentRevisionStatus.PendingChange,
    ];
    const canEditOutput = isRevised ||  editableIn.includes((values as DocumentRevision).status);
    let docRevMode: FBDocumentRevisionMode = canEditOutput ? "outputCreate" : "outputPreview";
    if (docRevMode === "outputCreate" && !_.isEmpty(values.id)) {
      docRevMode = "outputUpdate";
    }

    this.setGroupConfig({ docRevMode, schema, formInput });
  };

  @action private fmConfig = (values: DocumentRevision | DocumentRevisionFormValues) => {
    const schema = _.get(values, "formTemplate.schema") || [];
    const { formTemplate, formInput } = values;
    let docRevMode: FBDocumentRevisionMode = formTemplate ? "update" : "create";
    const isRevised = (values as DocumentRevisionFormValues).outputRevision;
    const isEditable = isRevised || canEditDocumentRevision(values as DocumentRevision);

    if (docRevMode === "update" && !isEditable) {
      docRevMode = "preview";
    }
    this.setGroupConfig({ docRevMode, schema, formInput });
  };

  @action private setGroupConfig = ({
    docRevMode,
    schema,
    formInput,
  }: FBDRGroupConfig) => {
    this.setMode(docRevMode);
    FBStore.setSchema(schema);
    FBStore.setValues(formInput);
  };
}

const FBDRStore = new FBDocumentRevisionStore();
export default FBDRStore;
