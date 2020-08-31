import { Dictionary, filter, first, get, isUndefined, map, set as lodashSet, uniqBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { FBFormValues } from "../../defaults/formik";
import FBAutocompleteAsyncStore from "../../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";
import { FBWorkspaceMode } from "../../types/workspace";
import FBDRStore from "./FBDRStore";
import editorStore from "./FBEditorStore";
import FBValidatorStore from "./FBValidatorStore";

export class FormBuilderStore {


  @computed public get active(): boolean {
    return this.mode !== "none";
  }

  @computed public get isStarter(): boolean {
    return (this.mode === "design") && (this.schema.length === 0);
  }

  @computed public get fieldMode(): Pick<FBInputProps, "disabled"> {
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
  public docId = "";
  public documentId = "";
  public stepSectionReg = /#([1-9][0-9]?|100)$/;
  public document: Partial<DocumentRevision> = {};

  public clearStores = () => {
    FBAutocompleteAsyncStore.data.clear();
  };

  public get isRevised(): boolean | undefined {
    const { version = 0, revision = 0, outputRevision } = this.document;
    return ((version > 1) && (revision > 1)) || outputRevision;
  }

  @action public setMode = (mode: FBWorkspaceMode) => {
    this.mode = mode;
    this.setModeConfig();
  };

  @action public setName = (name: string) => {
    this.name = name;
  };

  @action public getName = (): string | undefined => this.name;

  @action public getSchemaItem = (
    index?: number,
  ): FBTemplateSchema | undefined => {
    if (isUndefined(index)) {
      return;
    }
    return this.schema[index];
  };

  @action public getSchemaItemByName = (
    name: string,
  ): FBTemplateSchema | undefined => {
    const filtered = filter(this.schema, (schemaItem) => schemaItem.name === name);
    return filtered[0];
  };

  @action public getSchemaItemByType = (
    type: string,
  ): FBTemplateSchema | undefined => {
    const filtered = filter(this.schema, { type });
    return filtered[0];
  };

  @action public removeSchemaItem = (index?: number) => {
    if (index === undefined) {
      return;
    }
    const newSchema = this.schema.filter((o) => o.index !== index);
    this.setSchema(newSchema);
  };

  @action public editSchemaItem = (index?: number) => {
    if (index === undefined) {
      return;
    }
    const schema = this.getSchemaItem(index);
    if (!schema) {
      return;
    }
    FBValidatorStore.selectedFieldIndex = index;
    editorStore.editorTypeEdit(schema);
  };

  @action public getSchema = (): FBTemplateSchema[] => uniqBy(this.schema || [], "name");

  @action public getSectionStepReg = (label: string): string | undefined => {
    const reg = this.stepSectionReg.exec(label);
    return first(reg);
  };

  @action public setSchema = (newSchema: FBTemplateSchema[]) => {
    // let stepSectionCounter = 1;
    newSchema.map((o, i) => {
      o.index = i;
      // if (o.type === "stepsection" || o.type === "teststep") {
      //   const orderStr = this.getSectionStepReg(o.label as string);
      //   if (orderStr) {
      //     o.label = (o.label as string).replace(orderStr, `#${stepSectionCounter}`);
      //   } else {
      //     o.label += ` #${stepSectionCounter}`;
      //   }
      //   stepSectionCounter++;
      // }
      return o;
    });
    set(this, "schema", newSchema);
  };

  @action public clearSchema = () => {
    set(this, "schema", []);
  };

  @action public resetSchema = () => {
    const schema = this.schema;
    this.clearSchema();
    set(this, "schema", schema);
  };

  @action public setFormSchema = (newSchema: FBTemplateSchema[]) => {
    const filtered = filter(newSchema, (schemaItem) => schemaItem.type !== "action");
    filtered.map((o, i) => o.index = i);
    this.schema = filtered;
  };

  @action public getValues = () => {
    const initialValues: Dictionary<any> = {};
    map(this.getSchema(), (schemaItem) => {
      initialValues[schemaItem.name || ""] = FBFormValues[schemaItem.type || ""];
    });
    return {
      ...initialValues,
      ...this.values,
    };
  };

  @action public getValue = (name?: string): any => get(this.getValues(), name || "");

  @action public getValidationAttribute = () => {
    const attributes: Dictionary<string> = {};
    map(this.getSchema(), (schemaItem) => {
      attributes[schemaItem.name || ""] =
          (schemaItem.label as string) ||
          schemaItem.placeholder ||
          schemaItem.name ||
          "";
    });
    return attributes;
  };

  @action public setValues = (values: Dictionary<any> | undefined) => {
    this.values = values || {};
  };

  @action public setValue = (name: string | undefined, value: any) => {
    if (!name) {
      return;
    }
    this.setValues(lodashSet(this.values, name, value));
  };

  @action private setModeConfig = () => {
    switch (this.mode) {
      case "none":
      case "design":
        this.schema = FBDRStore.docSchema;
        this.values = {};
        break;
      default:
        return;
    }
  };

  @action private isDisabled = (): boolean => this.mode !== "form";
}

const FBStore = new FormBuilderStore();
export default FBStore;
