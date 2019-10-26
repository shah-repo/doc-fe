import _, { Dictionary } from "lodash";
import { action, autorun, computed, observable } from "mobx";
import Config from "../../../config";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { FBEditorSectionConfig } from "../defaults/editor";
import { FBFormDefaultProps } from "../types/common";
import { FBFormTemplateProps } from "../types/formik";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceMode } from "../types/workspace";
import editorStore from "./FBEditorStore";

export class FBStore {
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

  @computed get fieldMode(): Partial<FBFormDefaultProps> {
    return {
      disabled: this.isDisabled(),
      readOnly: this.isReadonly(),
      // className: this.isDisabled() ? FBClasses.inputDisabled : "",
    };
  }
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

  @action public getSchemaItem = (
    index: number,
  ): FBTemplateSchema | undefined => {
    return this.schema[index];
  };

  @action public removeSchemaItem = (index?: number) => () => {
    if (index === undefined) {
      return;
    }
    _.remove(this.schema, this.getSchemaItem(index));
  };

  @action public setSchema = (schema: FBTemplateSchema[]) => {
    this.schema = schema;
  };

  @action public getValues = (): { [key: string]: any } | undefined => {
    return _.isEmpty(this.values) ? undefined : this.values;
  };

  @action public reset = () => {
    this.name = undefined;
    this.schema = [];
    this.values = {};
    this.mode = "design";
    this.groupType = "OTHER";
    editorStore.reset();
  };

  @action public setFormTemplate = (formTemplate?: FBFormTemplateProps) => {
    formTemplate
      ? (this.schema = formTemplate.schema as FBTemplateSchema[])
      : this.reset();
  };

  @action public setFormTemplateDesign = (
    formTemplate?: FBFormTemplateProps,
  ) => {
    this.groupType = "FORM";
    this.mode = "design";
    this.setFormTemplate(formTemplate);
  };

  @action public setFormTemplatePreview = (
    formTemplate?: FBFormTemplateProps,
    inputValues?: Dictionary<any>,
  ) => {
    this.groupType = "FORM";
    this.mode = "preview";
    this.values = inputValues || {};
    this.setFormTemplate(formTemplate);
  };

  @action public setFormTemplateForm = (
    formTemplate?: FBFormTemplateProps,
    inputValues?: Dictionary<any>,
  ) => {
    this.groupType = "FORM";
    this.mode = "form";
    this.values = inputValues || {};
    this.setFormTemplate(formTemplate);
  };

  @action public importSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const schema = JSON.parse(event.target.result);
      this.schema = schema;
    };
    reader.readAsText(e.currentTarget.files![0]);
  };

  @action public exportSchema = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.schema));
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.download = `${this.name}.json`;
    anchor.href = dataStr;
    anchor.click();
  };

  @action public setName = (name: string) => {
    return (this.name = name);
  };

  @action private isDisabled = (): boolean => {
    return this.mode === "preview";
  };

  @action private isReadonly = (): boolean => {
    return this.mode !== "form";
  };
}

const formBuilderStore = new FBStore();
export default formBuilderStore;
