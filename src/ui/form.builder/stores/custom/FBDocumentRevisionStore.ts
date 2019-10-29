import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import { Id } from "../../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { DocumentType, DocumentTypeByIdState } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevisionFormValues } from "../../../documentRevision/forms/types";
import { FBFormTemplateProps } from "../../types/formik";
import { FBDocumentRevisionMode } from "../../types/store";
import formBuilderStore from "../FBStore";

export type FBDocumentRevisionRequestType =
  | "none"
  | "create"
  | "update"
  | "fbCreate"
  | "fbUpdate";

export class FBDocumentRevisionStore {

  @computed private get formTemplate(): FBFormTemplateProps | undefined {
    if (!this.fromDocumentRevision) { return undefined; }
    let { formTemplate } = this.fromDocumentRevision || {};
    const { formDocument } = this.fromDocumentRevision || {};
    if (formDocument ) {
      formTemplate = formDocument.formTemplate;
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

  @action public requestType(values: DocumentRevisionFormValues): FBDocumentRevisionRequestType {
    const { id, document, status, formDocument } = values;
    const { documentType } = document || {};
    const { group } = documentType || {};
    const isNew = (id === undefined);
    const isFromFB = !_.isEmpty(formDocument);
    const isStatus = (
      status === DocumentRevisionStatus.Draft ||
      status === DocumentRevisionStatus.PendingChange ||
      status === DocumentRevisionStatus.Released
    );

    switch (true) {
      case (isNew && isFromFB):
        return "fbCreate";
      case (!isNew && !isFromFB && isStatus):
        return "update";
      case (!isNew && isFromFB):
        return "fbUpdate";
      case (isNew && !isFromFB):
        return (group !== "FORM") ? "create" : "none";
      default:
        return "none";
    }
  }

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
          this.reset();
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

  @action public reset = () => {
    this.mode = "create";
    this.fromDocumentRevision = undefined;
  }
}

const documentRevisionStore = new FBDocumentRevisionStore();
export default documentRevisionStore;
