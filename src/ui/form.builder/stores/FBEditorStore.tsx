import { action, observable } from "mobx";
import React from "react";
import FBForm from "../components/form/FBForm";
import FBButton from "../components/inputs/FBButton";
import { FBEditorSectionConfig } from "../defaults/editor";
import { withEditorRenderer } from "../hocs/withEditorRenderer";
import FBEditorSection from "../main/editor/FBEditorSection";
import { FBEditorElementType, FBEditorModeType } from "../types/editor";
import { FBTemplateSchema } from "../types/store";
import formBuilderStore from "./FBStore";

export class FBEditorStore {
  @observable public open: boolean = false;
  @observable public content?: React.ReactNode;
  @observable public title?: string;
  private editorIndex: number = 0;
  private editorMode: FBEditorModeType = "create";

  @action public setOpen = (forIndex: number, withMode: FBEditorModeType) => () => {
    this.editorIndex = forIndex;
    this.editorMode = withMode;
    this.open = true;
    this.content = this.sections();
    this.title = "";
  }

  @action public reset = () => {
    this.open = false;
    this.editorIndex = 0;
    setTimeout(() => {
      this.content = undefined;
      this.title = undefined;
    }, 500);
  }

  @action public editorTypeRenderer = (
    type: FBEditorElementType,
    initialValues?: FBTemplateSchema,
    title?: string,
  ) => () => {
    this.content = (
      <FBForm
        initialValues={initialValues || {}}
        render={withEditorRenderer({
          type,
          index: this.editorIndex,
          mode: this.editorMode,
        })}
      />
    );
    this.title = title || "form.builder.create.field";
  }

  @action public editorTypeEdit = (index: number, withMode: FBEditorModeType) => () => {
    this.editorMode = withMode;
    const schema = formBuilderStore.schema[index];
    const { type } = schema;

    this.open = true;
    this.editorTypeRenderer(type, schema, "form.builder.edit.field")();
  }

  @action private sections = () => Object.keys(FBEditorSectionConfig).map((key) => (
    <FBEditorSection label={`form.builder.${key as string}`}>
      {this.generateElements(FBEditorSectionConfig[key])}
    </FBEditorSection>
  ))

  @action private generateElements = (elements: FBEditorElementType[]) =>
    elements.map((el) => (
      <FBButton
        label={`form.builder.${el as string}`}
        onClick={this.editorTypeRenderer(el)}
      />
    ))
}

const editorStore = new FBEditorStore();
export default editorStore;
