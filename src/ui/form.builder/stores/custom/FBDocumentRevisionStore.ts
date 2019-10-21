import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import { Id } from "../../../../state/ducks/common";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { DocumentType, DocumentTypeByIdState } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevisionFormValues } from "../../../documentRevision/forms/types";
import { FBFormTemplateProps } from "../../types/formik";
import { FBDocumentRevisionMode } from "../../types/store";
import formBuilderStore from "../FBStore";

export class FBDocumentRevisionStore {

  @computed private get formTemplate(): FBFormTemplateProps | undefined {
    if (!this.fromDocumentRevision) { return undefined; }
    let { formTemplate } = this.fromDocumentRevision || {};
    if (this.mode === "updateFromOther") {
      const { formDocument } = this.fromDocumentRevision;
      formTemplate = formDocument && formDocument.formTemplate;
    }
    return formTemplate;
  }

  @computed public get outputType(): DocumentType | undefined {
    if (!this.formTemplate) { return undefined; }
    return this.formTemplate.outputDocumentType as DocumentType;
  }

  @computed private get formDocument(): Id | undefined {
    if (!this.fromDocumentRevision) { return undefined; }
    return ({
      id: this.fromDocumentRevision.id,
    });
  }

  @computed public get outputActive(): boolean {
    return formBuilderStore.active && this.mode === "create";
  }
  @observable public mode: FBDocumentRevisionMode = "create";
  public fromDocumentRevision?: DocumentRevision = undefined;
  public documentTypesById: DocumentTypeByIdState = {};

  @action public setValues = (
    values: DocumentRevisionFormValues,
  ): DocumentRevisionFormValues => {
      switch (this.mode) {
        case "createFrom":
          if (!this.outputType) { return values; }
          return {
            ...values,
            document: {
              ...values.document,
              documentType: this.outputType,
            },
            formTemplate: this.formTemplate,
            formDocument: this.formDocument,
          };
        default:
          return values;
      }
    }

  @action public setMode = (
    mode: FBDocumentRevisionMode,
    record?: DocumentRevision,
  ) => {
    this.mode = mode;
    this.fromDocumentRevision = record;
    const ft = this.formTemplate;

    switch (mode) {
      case "update":
        const { documentType } = (record && record.document) || {};
        if (!documentType || documentType.group !== "FORM") {
          return this.reset();
        }
        return formBuilderStore.setFormTemplateDesign(ft);
      case "updateFromOther":
        const { formInput }: Dictionary<any> = record || {};
        const { formTemplate } = (record && record.formDocument) || {};
        if (!formTemplate) {
          return this.reset();
        }
        return formBuilderStore.setFormTemplateForm(ft, formInput);
      case "createFrom":
        return formBuilderStore.setFormTemplateForm(ft);
      case "create":
        this.reset();
        formBuilderStore.reset();
        return formBuilderStore.setFormTemplateDesign(ft);
    }
  }

  @action private reset = () => {
    this.mode = "create";
    this.fromDocumentRevision = undefined;
  }
}

const documentRevisionStore = new FBDocumentRevisionStore();
export default documentRevisionStore;
