import { action, computed, observable, set } from "mobx";
import { DocumentInfo, DocumentRevisionFormStateProps, SMStore } from "../../..";
import { DocumentType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { toastError } from "../../../../ui/components/notifications";
import { FBWorkspaceMode } from "../../../../ui/form.builder";
import { FBEndpoint } from "../../../../ui/form.builder/defaults/FBEndpoint";

export default class DocumentRevisionFormState implements DocumentRevisionFormStateProps {

  // MARK: @config
  public scrollOffset = 0;
  public formMode: FBWorkspaceMode = "none";
  public formAutosave = false;

  // MARK: @observables
  @observable public documentRevision?: DocumentRevision;
  @observable revisionChangeType?: RevisionChangeType;
  @observable createDocumentDisabled = false;
  @observable releasedDocRev?: DocumentRevision;
  @observable forceRender?: any;
  @observable public disabledAction = false;
  @observable public loading = false;
  @observable docInfo: DocumentInfo = {
    name: "",
    isQms: true,
    needsSignature: true,
  };

  /**
   * @cfg {boolean} Hidden status of header.
   */
  @observable isHeaderHidden = false;

  // MARK: @api

  // MARK: @constructor

  // MARK: @computed
  @computed public get id(): string | undefined {
    return this.documentRevision?.id;
  }

  @computed public get documentTypeId(): string {
    return this.documentType?.id || "";
  }

  @computed public get documentTypeAcronym(): string {
    return this.documentType?.documentTypeAcronym || "";
  }

  @computed public get documentType(): Partial<DocumentType> | undefined {
    return this.documentRevision?.document?.documentType;
  }

  @computed public get documentId(): string | undefined {
    return this.documentRevision?.document.id;
  }

  @computed public get docId(): string | undefined {
    return this.documentRevision?.document.docId;
  }

  // MARK: @actions
  @action public setDocumentRevisionChangeType = (revisionChangeType: RevisionChangeType) => {
    set(this, "revisionChangeType", revisionChangeType);
  };

  @action public setCreateDocumentDisabled = (disabled?: boolean) => {
    set(this, "createDocumentDisabled", disabled || false);
  };

  @action public setReleasedDocRev = (releasedDocRev?: DocumentRevision) => {
    set(this, "releasedDocRev", releasedDocRev);
  };

  @action public setDocInfo = (docInfo: DocumentInfo) => {
    set(this, "docInfo", docInfo);
  };

  @action public setForceRender = (forceRender: any) => {
    set(this, "forceRender", forceRender);
  };

  @action setIsHeaderHidden = (isHidden: boolean) => {
    set(this, "isHeaderHidden", isHidden);
  };

  @action public setDisabledAction = (disabledAction: boolean) => {
    set(this, "disabledAction", disabledAction);
  };

  // MARK: @helpers
  public setDocumentRevision = (documentRevision?: DocumentRevision | undefined) => {
    this.documentRevision = documentRevision;
  };

  public setScrollOffset = (offset: number) => {
    this.scrollOffset = offset;
  };

  public setFormMode = (mode: FBWorkspaceMode) => {
    this.formMode = mode;
  };

  public setFormAutosave = (autosave: boolean) => {
    this.formAutosave = autosave;
  };

  // *TODO
  // Extend this to have one saving point for doc rev (static and fb)
  public save = (name: string, value: any) => {
    if (!this.formAutosave) { return; }
    const { id } = this.documentRevision || {};
    if (!id) { return; }
    this.loading = true;
    SMStore.patch<{}, Partial<DocumentRevision>>({
      url: FBEndpoint.DocumentRevisionPatch,
      urlValues: { id },
      body: {
        [name]: value,
      },
    }, (data, error) => {
      if (error) {
        toastError(error.message);
        return;
      }
      const url = SMStore.templateUrl(FBEndpoint.DocumentRevisionPatch, { id });
      SMStore.setData<DocumentRevision>(url, data as DocumentRevision);
      this.loading = false;
    });
  };

}
