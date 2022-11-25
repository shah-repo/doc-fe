import { action, computed, observable, set } from "mobx";
import { DocumentInfo, DocumentRevisionFormStateProps, SMStore } from "../../..";
import { Id } from "../../../../state/ducks/common/types";
import { DocumentType, DOC_TYPE_GROUP_OPTION } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionDocument, DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { toastError } from "../../../../ui/components/notifications";
import { FBInputType, FBSchemaProps, FBWorkspaceMode } from "../../../../ui/form.builder";
import { FBEndpoint } from "../../../../ui/form.builder/defaults/FBEndpoint";

export default class DocumentRevisionFormState implements DocumentRevisionFormStateProps {

  // MARK: @config
  public scrollOffset = 0;
  public formMode: FBWorkspaceMode = "none";
  public formAutosave = false;
  // Hack because formik context from autosave & reference comp are not the same ref
  // and we need to know the values from both FB and AvailableReferences to create
  // new merged value
  public referenceValue: Id[] = [];

  // MARK: @observables
  @observable public documentRevision?: DocumentRevision;
  @observable public revisionChangeType?: RevisionChangeType;
  @observable public createDocumentDisabled = false;
  @observable public releasedDocRev?: DocumentRevision;
  @observable public forceRender?: any;
  @observable public disabledAction = false;
  @observable public loading = false;
  @observable public formSchema: FBSchemaProps[] = [];
  @observable public expanded = false;
  @observable public isLHRProgressBarVisible = false;
  @observable public isDesTextClamped = false;
  @observable public isDescriptionFocused = false;
  @observable docInfo: DocumentInfo = {
    name: "",
    isQms: true,
    needsSignature: true,
  };

  /**
   * @cfg {boolean} Hidden status of header.
   */
  @observable isHeaderHidden = false;
  /**
   * @cfg {boolean} Left Panel open/close.
   */
  @observable public leftPanelOpen = false;

  /**
   * @cfg {string} Selected Tab Name at the time of opening form builder Library
   */
  public selectedTabIdForSchemaAddition = "";

  /**
   * @cfg {boolean} Right Panel open/close.
   */
  @observable public rightPanelOpen = true;

  @observable public isDirty = false;

  @observable public viewMore = false;

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

  @computed public get document(): DocumentRevisionDocument | undefined {
    return this.documentRevision?.document;
  }

  @computed public get schema(): FBSchemaProps[] {
    return this.formSchema;
  }

  // MARK: @actions
  @action public setDocumentRevisionChangeType = (revisionChangeType: RevisionChangeType) => {
    set(this, "revisionChangeType", revisionChangeType);
  };

  @action public setIsLHRProgressBarVisible = (visible: boolean) => {
    set(this, "isLHRProgressBarVisible", visible);
  };

  @action public setExpanded = (expand) => {
    set(this, "expanded", expand);
  };

  @action public setDescriptionFocused = (focused: boolean) => {
    set(this, "isDescriptionFocused", focused);
  };

  @action public setIsDescTextClamped = (clamped: boolean) => {
    set(this, "isDesTextClamped", clamped);
  };

  @action public setViewMore = (flag: boolean) => {
    set(this, "viewMore", !flag);
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

  @action public setDirty = (isDirty: boolean) => {
    set(this, "isDirty", isDirty);
  };

  @action setLeftPanelOpen = () => set(this, "leftPanelOpen", !this.leftPanelOpen);
  @action setRightPanelOpen = () => set(this, "rightPanelOpen", !this.rightPanelOpen);

  @action public setTabIdForSchemaAddition = (tabName: string) => {
    set(this, "selectedTabIdForSchemaAddition", tabName);
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

  public setFBSchema = (schema?: FBSchemaProps[]) => {
    set(this, "formSchema", schema);
  };

  public getFBNames = (byType?: FBInputType): string[] => {
    if (!byType) { return []; }
    return this.formSchema.reduce((names: string[], item) => {
      if (item.deleted || item.type !== byType) { return names; }
      if (item.name) {
        names.push(item.name);
      }
      return names;
    }, []);
  };

  public get isOutputSchema(): boolean {
    const { documentType: { groupOptions = [] } = {} } = this.document ?? {};
    return groupOptions.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA);
  }

  // *TODO
  // Extend this to have one saving point for doc rev (static and fb)
  public save = (name: string, value: any) => {
    if (this.documentRevision?.status === DocumentRevisionStatus.Released) { return; }
    this.setDirty(true);
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
      this.setDirty(false);
      const url = SMStore.templateUrl(FBEndpoint.DocumentRevisionPatch, { id });
      SMStore.setData<DocumentRevision>(url, data as DocumentRevision);
      this.loading = false;
    });
  };

}
