import _ from "lodash";
import { action, computed, observable } from "mobx";
import { FBEditorSectionConfig } from "../defaults/editor";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceMode } from "../types/workspace";

export class FBStore {
  @observable public name?: string = undefined;
  @observable public documentType?: string = undefined;
  @observable public documentId?: string = undefined;
  @observable public schema: FBTemplateSchema[] = [];
  @observable public values: { [key: string]: any } = {};
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

  @action public reset = () => {
    this.name = undefined;
    this.documentType = undefined;
    this.documentId = undefined;
    this.schema = [];
    this.values = {};
    this.mode = "design";
  }

  // * NOTE: For demo only will be removed
  @action public submitTemplate = () => {
    const tplStr = localStorage.getItem("fbTemplates");
    const templates = tplStr ? JSON.parse(tplStr) : [];
    const filtered = _.filter(templates, (template) => template.documentId !== this.documentId);
    const newTemplate = _.pick(this, ["documentType", "documentId", "schema"]);
    filtered.push(newTemplate);
    localStorage.setItem("fbTemplates", JSON.stringify(filtered));
  }

  @action public submitValue = () => {
    const valueStr = localStorage.getItem("fbValues");
    const values = valueStr ? JSON.parse(valueStr) : [];
    const filtered = _.filter(values, (value) => value.documentId !== this.documentId);
    const newValues = _.pick(this, ["documentId", "values"]);
    filtered.push(newValues);
    localStorage.setItem("fbValues", JSON.stringify(filtered));
  }

  @action public setTemplate = (documentId: string) => {
    const tplStr = localStorage.getItem("fbTemplates");
    const templates = tplStr ? JSON.parse(tplStr) : [];
    const filtered = _.filter(templates, (template) => template.documentId === documentId);
    if (filtered.length > 0) {
      this.documentId = documentId;
      this.documentType = filtered[0].documentType;
      this.schema = filtered[0].schema;
    }
  }

  @action public setValue = (documentId: string) => {
    const valueStr = localStorage.getItem("fbValues");
    const values = valueStr ? JSON.parse(valueStr) : [];
    const filtered = _.filter(values, (value) => value.documentId === documentId);
    if (filtered.length > 0) {
      this.documentId = documentId;
      this.values = filtered[0].values;
    }
  }
}

export const formBuilderStore = new FBStore();
