import _ from "lodash";
import { action, computed, get, observable, set } from "mobx";
import { FBWorkspaceConstructor, FBWorkspaceMode } from ".";
import { FBSchemaState } from "..";

export class FBWorkspaceState extends FBSchemaState {
  @observable public mode: FBWorkspaceMode = "none";

  public constructor({ schema, mode }: FBWorkspaceConstructor) {
    super(schema);
    this.schema = schema;
    this.mode = mode || "none";
  }

  @computed public get active(): boolean {
    return this.mode !== "none";
  }

  @computed public get isStarter() {
    return (this.mode === "design" && _.size(this.schema) === 0);
  }

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
