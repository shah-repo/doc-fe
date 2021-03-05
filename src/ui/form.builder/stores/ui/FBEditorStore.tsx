import { get, isUndefined } from "lodash";
import { action, observable } from "mobx";
import React from "react";
import FBForm from "../../components/form/FBForm";
import { withEditorRenderer } from "../../hocs/withEditorRenderer";
import { FBEditorElementType, FBEditorModeType } from "../../types/editor";
import { FBTemplateSchema } from "../../types/store";
import FBValidatorStore from "../ui/FBValidatorStore";
import FBDynamicValidatorStore from "./FBDynamicValidatorStore";
import FBStore from "./FBStore";

class FBEditorStore {
  @observable public open = false;
  @observable public content?: React.ReactNode = undefined;
  @observable public title?: string = undefined;
  @observable public maxWidth?: "sm" | "md" | "lg" = "md";
  @observable public isHelloSignIntegrationEnabled?: boolean = false;
  public editorIndex = 0;
  public editorMode: FBEditorModeType = "create";

  @action public setOpen = (forIndex = -1) => () => {
    this.open = true;
    this.editorIndex = forIndex + 1;
    // this.content = this.sections();
    this.title = "";
    this.editorMode = "create";
  };

  @action public reset = () => {
    this.open = false;
    FBValidatorStore.applicableOn = false;
    FBDynamicValidatorStore.reset();
    FBValidatorStore.resetIndicatorValues();
    FBValidatorStore.selectedFieldIndex = null;
    setTimeout(() => {
      this.content = undefined;
      this.title = undefined;
    }, 500);
  };

  @action public editorTypeRenderer = (
    type: FBEditorElementType,
    initialValues?: FBTemplateSchema,
    title?: string,
  ) => () => {

    FBValidatorStore.formValues = get(initialValues, "formValuesRules") || {};

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
  };

  @action public editorTypeEdit = (schema: FBTemplateSchema) => {
    if (isUndefined(schema.index)) {
      return;
    }
    const { type, index, customValidator, name = "" } = schema;
    this.editorIndex = index;
    this.editorMode = "update";
    this.open = true;
    const formValues = FBStore.getValue(name);
    const newSchema = {
      ...schema,
      ...formValues,
    };
    FBDynamicValidatorStore.setDynamicValidator(customValidator);
    this.editorTypeRenderer(
      type as FBEditorElementType,
      newSchema,
      "form.builder.edit.field",
    )();
  };

  //   @action private sections = () => {};
  //   // Object.keys(FBEditorSectionConfig).map((key, i) => (
  //   //   <FBEditorSection
  //   //     key={`form.builder.${key}-${i}`}
  //   //     label={`form.builder.${key}`}
  //   //   >
  //   //     {this.generateElements(FBEditorSectionConfig[key])}
  //   //   </FBEditorSection>
  //   // ));

  //   @action private generateElements = (elements: FBEditorElementType[]) => elements.map((el, i) => {
  //     if (el === "hellosign" && !this.isHelloSignIntegrationEnabled) {
  //       return null;
  //     }

  //     if (el === "approvalMatrix" && FBStore.getSchemaItemByType("approvalMatrix")) {
  //       return null;
  //     }

//     return (
//       <FBButton
//         key={`form.builder.${el as string}-${i}`}
//         label={`form.builder.${el as string}`}
//         onClick={this.editorTypeRenderer(el)}
//       />
//     );
//   });
}

const editorStore = new FBEditorStore();
export default editorStore;
