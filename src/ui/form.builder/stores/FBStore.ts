import { action, computed, observable } from "mobx";
import { FBEditorSectionConfig } from "../defaults/editor";
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

  @action public toolbarMargin(schemaIndex: number): number {
    const { type, label } = this.schema[schemaIndex];
    if (FBEditorSectionConfig.basics.includes(type) ) {
      return -4;
    }
    return 0;
  }

  @action public getSchema = (index: number): FBTemplateSchema => {
    return this.schema[index];
  }

  @action public removeSchema = (index: number) => () => {
    this.schema.splice(index, 1);
  }
}

export const formBuilderStore = new FBStore();
