import { action, observable } from "mobx";
import React from "react";
import FBForm from "../components/form/FBForm";
import FBButton from "../components/inputs/FBButton";
import { FBEditorSectionConfig } from "../defaults/editor";
import { withEditorRenderer } from "../hocs/withEditorRenderer";
import FBEditorSection from "../main/editor/FBEditorSection";
import { FBEditorElementType, FBEditorModeType } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export class FBEditorStore {
  @observable public open: boolean = false;
  @observable public content?: React.ReactNode = undefined;
  @observable public title?: string = undefined;
  public editorIndex: number = 0;
  public editorMode: FBEditorModeType = "create";

  @action public setOpen = (forIndex: number = -1) => () => {
    this.open = true;
    this.content = this.sections();
    this.title = "";
    this.editorIndex = forIndex + 1;
    this.editorMode = "create";
  }

  @action public reset = () => {
    this.open = false;
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

  @action public editorTypeEdit = (schema: FBTemplateSchema) => {
    const { type, index } = schema;
    this.editorIndex = index;
    this.editorMode = "update";
    this.open = true;
    this.editorTypeRenderer(type, schema, "form.builder.edit.field")();
  }

  @action private sections = () => Object.keys(FBEditorSectionConfig).map((key, i) => (
    <FBEditorSection
      key={`form.builder.${key as string}-${i}`}
      label={`form.builder.${key as string}`}
    >
      {this.generateElements(FBEditorSectionConfig[key])}
    </FBEditorSection>
  ))

  @action private generateElements = (elements: FBEditorElementType[]) =>
    elements.map((el, i) => (
      <FBButton
        key={`form.builder.${el as string}-${i}`}
        label={`form.builder.${el as string}`}
        onClick={this.editorTypeRenderer(el)}
      />
    ))
}

const editorStore = new FBEditorStore();
export default editorStore;
