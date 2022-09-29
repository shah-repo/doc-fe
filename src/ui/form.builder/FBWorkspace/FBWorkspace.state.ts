import { includes, isArray, isEmpty, isUndefined, map, omit, size } from "lodash";
import { action, computed, get, observable, set } from "mobx";
import { FBInlineApprovalBody, FBLHRBuildOptions, FBSchemaState, FBWorkspaceConstructor, FBWorkspaceExternalState, FBWorkspaceMode } from "..";
import { appGlobals } from "../../../appGlobals";
import { GroupTag, UserState } from "../../../state/ducks/auth/types";
import { ChangeRequest, ChangeRequestStatus } from "../../../state/ducks/changeRequest/types";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus, RevisionChangeType, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from "../FBInput/FBInput.wrap";
import FBDataStore from "../FBStore/FBDataStore";
import FBStore from "../FBStore/FBStore";

class FBWorkspaceState extends FBSchemaState {
  @observable public mode: FBWorkspaceMode = "none";
  @observable approvals?: FBInlineApprovalBody[];
  @observable loadAudit = false;
  @observable revisionChangeType?: RevisionChangeType;
  // Buffer between _formState loading and documentRevApi loading until we switch
  // everything to _formState
  @observable public loading = false;
  public externalState?: FBWorkspaceExternalState;
  public document?: DocumentRevision;
  public changeRequest?: ChangeRequest;
  @observable public autosave?: boolean;
  public documentRevApi = new FBRequest<DocumentRevision, Partial<DocumentRevisionEditRequestBody>>();
  public loadDocumentRevApi = new FBRequest<DocumentRevision, Partial<DocumentRevisionEditRequestBody>>();

  @observable public formInputSync = new Map<string, any>();
  public formInput?: Record<string, any>;

  @observable public isDirty = false;

  // @todo: Remove after moving fields validation to higher level.
  @observable public hiddenFieldsByRules = new Set<string>();

  public omitAutosave = false;

  public constructor({ schema, mode, autosave }: FBWorkspaceConstructor) {
    super(schema);
    this.schema = schema || [];
    this.mode = mode || "none";
    this.autosave = autosave;
  }

  public get auth(): FBWorkspaceExternalState["auth"] | undefined {
    return this.externalState?.auth;
  }

  public get currentUser(): UserState | undefined {
    return this.auth?.user;
  }

  public get userTags(): GroupTag[] | undefined {
    return this.auth?.groups.tags;
  }

  public get company(): FBWorkspaceExternalState["company"] | undefined {
    return this.externalState?.company;
  }

  public get id(): string | undefined {
    return this.document?.id || this.changeRequest?.id;
  }

  public get documentId(): string | undefined {
    return this.document?.document?.id;
  }

  public get documentStatus(): DocumentRevisionStatus {
    return this.document?.status || DocumentRevisionStatus.Draft;
  }

  public get changeRequestStatus(): ChangeRequestStatus {
    return this.changeRequest?.state || ChangeRequestStatus.Draft;
  }

  public get isReleased(): boolean {
    return this.document?.status === DocumentRevisionStatus.Released;
  }

  public get isDraft(): boolean {
    return this.document?.status === DocumentRevisionStatus.Draft;
  }

  public get isPendingChange(): boolean {
    return this.document?.status === DocumentRevisionStatus.PendingChange;
  }

  public get isDeprecated(): boolean {
    return this.document?.status === DocumentRevisionStatus.Deprecated;
  }

  public get isOutput(): boolean {
    const { docId } = this.document?.formDocument?.document || {};
    return Boolean(docId && !isEmpty(docId));
  }

  public get isLHRProductionBuild(): boolean {
    return this.document?.smartReferencesTo?.filter(
      (ref) => ref.active && ref.type === SmartReferenceType.HiddenPiInstance)[0]?.
      toDocRev?.formInput?.["lhr-build-type"] === FBLHRBuildOptions.Production;
  }

  public get isOutputSchema(): boolean {
    const { documentType: { groupOptions = [] } = {} } = this.document?.document ?? {};
    return groupOptions.includes(DOC_TYPE_GROUP_OPTION.EDITABLE_SCHEMA);
  }

  public get isRevised(): boolean | undefined {
    const { version = 0, revision = 0, outputRevision = false } = this.document || {};
    return ((version > 1) && (revision > 1)) || outputRevision;
  }


  @computed public get active(): boolean {
    return this.mode !== "none";
  }

  @computed public get isStarter() {
    return (
      (this.mode === "design" || this.mode === "formDesign") &&
      !size(this.schema?.filter((item) => !item.deleted))
    );
  }

  // TO BE REMOVED!!
  @action public resetSchema = () => {
    const schema = this.schema;
    set(this, "schema", []);
    set(this, "schema", schema);
  };

  @action public setMode = (mode: FBWorkspaceMode) => {
    set(this, "mode", mode);
  };

  @action public setAutosave = (autosave: boolean) => {
    set(this, "autosave", autosave);
  };

  @action public setDocumentRevisionChangeType = (revisionChangeType: RevisionChangeType) => {
    set(this, "revisionChangeType", revisionChangeType);
  };

  @action public getMode = (): FBWorkspaceMode => get(this, "mode");

  @action public getFieldByName = (name: string) => this.document?.formInput?.[name];

  @action public isMode = (mode: FBWorkspaceMode | FBWorkspaceMode[]): boolean => {
    if (isArray(mode)) {
      return includes(mode, this.mode);
    }
    return this.mode === mode;
  };

  @action public getIsInputOwner = ( name: string ): boolean => {
    const {
      document,
      externalState: { auth: { user: { employeeId = "" } = {} } = {} } = {},
    } = this || {};
    const inputOwner = document?.inputOwners?.[name];

    return inputOwner === undefined || inputOwner === employeeId;
  };

  @action public setDirty = (isDirty: boolean) => {
    set(this, "isDirty", isDirty);
  };

  @action public setFormInputSync = (name: string, value: any) => {
    set(this.formInputSync, name, value);
  };

  public removeAutoState = () => {
    this.schema = this.schema?.map((schemaItem) => omit(schemaItem, ["autoFocus", "autoScrollTo"]));
  };

  public saveDocRev = (values?: Record<string, any>) => {
    this.loadAudit = false;
    const { id, mode, autosave } = this;
    if ((mode === "form") && !values) { return; }
    if (!autosave) { return; }
    if (!id) { return; }
    this.loading = true;
    const schema = this.schema?.map((schemaItem) => omit(schemaItem, ["autoFocus", "autoScrollTo"]));
    let body = {};
    switch (mode) {
      case "design":
        body = {
          formTemplate: { schema },
        };
        break;
      case "form":
      case "formDesign":
        if (values) {
          body = {
            formInput: omit(values,
              Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES })),
            ...mode === "formDesign" && this.isOutputSchema && { schema },
          };
        } else {
          body = {
            ...mode === "formDesign" && this.isOutputSchema && { schema },
          };
        }
        break;
      default:
        return;
    }
    this.omitAutosave = true;
    appGlobals.omitReloadNotification = true;
    const url = isUndefined(this.document) ? FBEndpoint.ChangeRequestPatch : FBEndpoint.DocumentRevisionPatch;
    this.documentRevApi.set({
      url,
      urlValues: { id },
      body,
      method: "patch",
    }, (data, error) => {
      this.omitAutosave = false;
      if (error) {
        this.documentRevApi.onError(error);
        this.loading = false;
      } else {
        this.setDirty(false);
        this.setFormInputData(data);
        if (!isEmpty(this.getItemsByType("inlineapproval"))) {
          FBStore.audit.set({
            url: FBEndpoint.DocumentRevisionAudit,
            urlValues: { documentId: id },
            method: "get",
          });
        }
        if (FBStore?.isHistoryTabSelected) {
          this.loadAudit = true;
        }
        this.documentRevApi.onSuccess();
        FBDataStore.setRefreshData(data);
        this.loading = false;
      }
    });
  };

  private setFormInputData = (data?: DocumentRevision) => {
    const { formInput = {} } = data ?? {};
    this.formInput = formInput;
    map(formInput, (value, key) => {
      set(this.formInputSync, key, value);
    });
  };

  public loadDocRev = (values?: Record<string, any>) => {
    const { id } = this;
    if (!id) { return; }

    this.loadDocumentRevApi.set({
      url: FBEndpoint.DocumentRevisionPatch,
      urlValues: { id },
      method: "get",
    }, (data, error) => {
      if (error) {
        this.loadDocumentRevApi.onError(error);
      } else {
        this.loadDocumentRevApi.onSuccess();
        this.setFormInputData(data);
      }
    });
  };

  @action public addHiddenFieldByRules = (name: string): void => {
    this.hiddenFieldsByRules.add(name);
  };

  @action public deleteHiddenFieldByRules = (name: string): void => {
    this.hiddenFieldsByRules.delete(name);
  };
}

export default FBWorkspaceState;
