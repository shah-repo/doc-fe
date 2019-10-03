import { computed, observable } from "mobx";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceMode } from "../types/workspace";

export class FBStore {
  @observable public name?: string = undefined;
  @observable public documentType?: string = undefined;
  @observable public documentId?: string = undefined;
  @observable public schema: FBTemplateSchema[] = [];
  @observable public mode: FBWorkspaceMode = "design";

  @computed get prefixName() {
    return `${this.schema.length}_${(this.name || "").replace(" ", "")}`;
  }
}

export const formBuilderStore = new FBStore();
