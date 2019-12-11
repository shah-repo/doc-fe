import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import { FBFormValues } from "../../defaults/formik";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";
import { FBWorkspaceMode } from "../../types/workspace";
import editorStore from "./FBEditorStore";

export class FormBuilderStore {
  @computed get active(): boolean {
    return this.mode !== "none";
  }

  @computed get isStarter(): boolean {
    return (this.mode === "design") && (this.schema.length === 0);
  }

  @computed get fieldMode(): Pick<FBInputProps, "disabled"> {
    return {
      disabled: this.isDisabled(),
      // readOnly: this.isReadonly(),
      // className: this.isDisabled() ? FBClasses.inputDisabled : "",
    };
  }

  @observable public name?: string = undefined;
  @observable public schema: FBTemplateSchema[] = [];
  @observable public values: Dictionary<any> = {};
  @observable public mode: FBWorkspaceMode = "none";

  @action public setMode = (mode: FBWorkspaceMode) => {
    this.mode = mode;
    this.setModeConfig();
  }

  @action public setName = (name: string) => {
    this.name = name;
  }

  @action public getName = (): string | undefined => {
    return this.name;
  }

  @action public getSchemaItem = (
    index: number,
  ): FBTemplateSchema | undefined => {
    return this.schema[index];
  }

  @action public getSchemaItemByName = (
    name: string,
  ): FBTemplateSchema | undefined => {
    const filtered = _.filter(this.schema, (schemaItem) => schemaItem.name === name);
    return filtered[0];
  }

  @action public removeSchemaItem = (index?: number) => {
    if (index === undefined) {
      return;
    }
    const newSchema = this.schema.filter((o) => o.index !== index);
    this.setSchema(newSchema);
  }

  @action public editSchemaItem = (index?: number) => {
    if (index === undefined) {
      return;
    }
    const schema = this.getSchemaItem(index);
    if (!schema) {
      return;
    }
    editorStore.editorTypeEdit(schema);
  }

  @action public getSchema = (): FBTemplateSchema[] => {
    return this.schema;
  }

  @action public setSchema = (newSchema: FBTemplateSchema[]) => {
    newSchema.map((o, i) => o.index = i);
    this.schema = newSchema;
  }

  @action public getValues = () => {
    if (_.isEmpty(this.values)) {
      const initialValues: Dictionary<any> = {};
      _.map(this.getSchema(), (schemaItem) => {
        initialValues[schemaItem.name || ""] = FBFormValues[schemaItem.type || ""];
      });
      return initialValues;
    }
    return this.values;
  }

  @action public setValues = (values: Dictionary<any> | undefined) => {
    this.values = values || {};
  }

  @action private setModeConfig = () => {
    switch (this.mode) {
      case "none":
      case "design":
        this.schema = [];
        this.values = {};
        break;
      default:
        return;
    }
  }

  @action private isDisabled = (): boolean => {
    return this.mode !== "form";
  }
}

const FBStore = new FormBuilderStore();
export default FBStore;
