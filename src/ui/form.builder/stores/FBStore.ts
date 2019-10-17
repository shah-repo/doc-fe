import _ from "lodash";
import { action, autorun, computed, observable } from "mobx";
import Config from "../../../config";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { FBEditorSectionConfig } from "../defaults/editor";
import { FBFormTemplateProps } from "../types/formik";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceMode } from "../types/workspace";
import editorStore from "./FBEditorStore";

export class FBStore {
  @observable public name?: string = undefined;
  @observable public schema: FBTemplateSchema[] = [];
  @observable public values: { [key: string]: any } = {};
  @observable public mode: FBWorkspaceMode = "design";
  @observable public groupType: DocumentGroupType = "OTHER";

  constructor() {
    autorun(() => {
      if (this.groupType === "OTHER") {
        this.reset();
      }
    });
  }

  @computed get prefixName() {
    return `${this.schema.length}_${(this.name || "").replace(" ", "")}`;
  }

  @computed get formInput(): string {
    const formInput = _.pick(this, ["documentOutputType", "schema", "values"]);
    return JSON.stringify(formInput);
  }

  @computed get active(): boolean {
    return Config.Theme === ThemeEnv.DEV_THEME && this.groupType === "FORM";
  }

  @action public toolbarMargin(schemaIndex: number): number {
    const { type, label } = this.schema[schemaIndex];
    if (!FBEditorSectionConfig.section.includes(type) && label) {
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
    this.schema = [];
    this.values = {};
    this.mode = "design";
    this.groupType = "OTHER";
    editorStore.reset();
  }

  @action public setFormTemplate = (formTemplate?: FBFormTemplateProps) => {
    if (!formTemplate) {
      this.schema = [];
    } else {
      const { schema } = formTemplate;
      this.schema = schema as FBTemplateSchema[];
    }
  }

  @action public set = (json?: string) => {
    if (!json) {
      this.reset();
      return;
    }
    const { schema, values } = JSON.parse(json) as FBStore;
    this.schema = schema || [];
    this.values = values || {};
  }

  // * NOTE: For demo only will be removed
  @action public submitTemplate = () => {
    // const tplStr = localStorage.getItem("fbTemplates");
    // const templates = tplStr ? JSON.parse(tplStr) : [];
    // const filtered = _.filter(templates, (template) => template.documentId !== this.documentId);
    // const newTemplate = _.pick(this, ["documentOutputType", "documentId", "schema"]);
    // filtered.push(newTemplate);
    // localStorage.setItem("fbTemplates", JSON.stringify(filtered));
  }

  @action public submitValue = () => {
    // const valueStr = localStorage.getItem("fbValues");
    // const values = valueStr ? JSON.parse(valueStr) : [];
    // const filtered = _.filter(values, (value) => value.documentId !== this.documentId);
    // const newValues = _.pick(this, ["documentId", "values"]);
    // filtered.push(newValues);
    // localStorage.setItem("fbValues", JSON.stringify(filtered));
  }

  @action public setTemplate = (documentId: string) => {
    // const tplStr = localStorage.getItem("fbTemplates");
    // const templates = tplStr ? JSON.parse(tplStr) : [];
    // const filtered = _.filter(templates, (template) => template.documentId === documentId);
    // if (filtered.length > 0) {
    //   this.documentOutputType = filtered[0].documentOutputType;
    //   this.schema = filtered[0].schema;
    // }
  }

  @action public setValue = (documentId: string) => {
    // const valueStr = localStorage.getItem("fbValues");
    // const values = valueStr ? JSON.parse(valueStr) : [];
    // const filtered = _.filter(values, (value) => value.documentId === documentId);
    // if (filtered.length > 0) {
    //   this.values = filtered[0].values;
    // }
  }
}

const formBuilderStore = new FBStore();
export default formBuilderStore;
