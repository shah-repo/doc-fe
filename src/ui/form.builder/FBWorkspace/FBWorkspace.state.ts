import _ from "lodash";
import { action, computed, get, observable, set } from "mobx";
import { FBWorkspaceConstructor, FBWorkspaceMode } from ".";
import { FBSchemaState } from "..";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";

export class FBWorkspaceState extends FBSchemaState {
  @observable public mode: FBWorkspaceMode = "none";
  public document?: DocumentRevision;
  public autosave?: boolean;

  public constructor({ schema, mode, autosave, document }: FBWorkspaceConstructor) {
    super(schema);
    this.schema = schema;
    this.mode = mode || "none";
    this.autosave = autosave;
    this.document = document;
  }

  public get id(): string | undefined {
    const { id } = this.document || {};
    return id;
  }

  public get documentId(): string | undefined {
    const { id } = this.document?.document || {};
    return id;
  }

  public get isReleased(): boolean {
    const { status } = this.document || {};
    return status === DocumentRevisionStatus.Released;
  }

  public get isOutput(): boolean {
    const { docId } = this.document?.formDocument?.document || {};
    return Boolean(docId && !_.isEmpty(docId));
  }

  public get isRevised(): boolean | undefined {
    const { version = 0, revision = 0, outputRevision = false } = this.document || {};
    return ((version > 1) && (revision > 1)) || outputRevision;
  }

  @computed public get active(): boolean {
    return this.mode !== "none";
  }

  @computed public get isStarter() {
    return (this.mode === "design" && _.size(this.schema) === 0);
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
    if (_.isArray(mode)) {
      return _.includes(mode, this.mode);
    }
    return this.mode === mode;
  };
}

export default FBWorkspaceState;
