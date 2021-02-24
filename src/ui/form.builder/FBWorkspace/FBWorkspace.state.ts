import { includes, isArray, isEmpty, size } from "lodash";
import { action, computed, get, observable, set } from "mobx";
import { FBInlineApprovalBody, FBSchemaState, FBWorkspaceConstructor, FBWorkspaceExternalState, FBWorkspaceMode } from "..";
import { GroupTag, UserState } from "../../../state/ducks/auth/types";
import { ChangeRequest, ChangeRequestStatus } from "../../../state/ducks/changeRequest/types";
import { Id } from "../../../state/ducks/common/types";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";

class FBWorkspaceState extends FBSchemaState {
  @observable public mode: FBWorkspaceMode = "none";
  @observable approvals?: FBInlineApprovalBody[];
  public externalState?: FBWorkspaceExternalState;
  public document?: DocumentRevision;
  public changeRequest?: ChangeRequest;
  public autosave?: boolean;

  // Hack because formik context from autosave & reference comp are not the same ref
  // and we need to know the values from both FB and AvailableReferences to create
  // new merged value
  public referenceValue: Id[] = [];

  public constructor({ schema, mode, autosave }: FBWorkspaceConstructor) {
    super(schema);
    this.schema = schema;
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

  public get isOutput(): boolean {
    const { docId } = this.document?.formDocument?.document || {};
    return Boolean(docId && !isEmpty(docId));
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

  @action public getMode = (): FBWorkspaceMode => get(this, "mode");

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
}

export default FBWorkspaceState;
