import _, { Dictionary } from "lodash";
import { action, autorun, computed, observable } from "mobx";
import Config from "../../../config";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { FBEditorSectionConfig } from "../defaults/editor";
import { FBClasses } from "../defaults/layout";
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
    return this.groupType === "FORM";
  }

  @computed get fieldMode(): Partial<FBFormDefaultProps> {
    return ({
      disabled: this.isDisabled(),
      readOnly: this.isReadonly(),
      // className: this.isDisabled() ? FBClasses.inputDisabled : "",
    });
  }
  @observable public name?: string = undefined;
  @observable public schema: FBTemplateSchema[] = [];
  @observable public values: { [key: string]: any } = {};
  @observable public mode: FBWorkspaceMode = "design";
  @observable public groupType: DocumentGroupType = "OTHER";
  public changeReqRevisions: DocumentRevision[] = [];

  constructor() {
    autorun(() => {
      if (this.groupType === "OTHER") {
        this.reset();
      }
    });
  }

  @action public getDocRev = (id: string): DocumentRevision | undefined => {
    const docRev = this.changeReqRevisions.filter((doc) => doc.id === id);
    if (docRev.length === 0) { return undefined; }
    return docRev[0];
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

  @action public getValues = (): { [key: string]: any } | undefined => {
    return _.isEmpty(this.values) ? undefined : this.values;
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
    (formTemplate) ?
      this.schema = formTemplate.schema as FBTemplateSchema[] :
      this.reset();
  }

  @action public setFormTemplateDesign = (formTemplate?: FBFormTemplateProps) => {
    this.groupType = "FORM";
    this.mode = "design";
    this.setFormTemplate(formTemplate);
  }

  @action public setFormTemplatePreview = (
    formTemplate?: FBFormTemplateProps,
    inputValues?: Dictionary<any>,
    ) => {
    this.groupType = "FORM";
    this.mode = "preview";
    this.values = inputValues || {};
    this.setFormTemplate(formTemplate);
  }

  @action public setFormTemplateForm = (
    formTemplate?: FBFormTemplateProps,
    inputValues?: Dictionary<any>,
  ) => {
    this.groupType = "FORM";
    this.mode = "form";
    this.values = inputValues || {};
    this.setFormTemplate(formTemplate);
  }

  @action private isDisabled = (): boolean => {
    return this.mode === "preview";
  }

  @action private isReadonly = (): boolean => {
    return this.mode !== "form";
  }
}

const formBuilderStore = new FBStore();
export default formBuilderStore;
