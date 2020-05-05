import React from "react";
import { FBControlPickerDataProps, FBInputType } from "..";
import { FBEditorCustomControl } from "../FBEditorCustomControl";

export class FBControlPickerState {
  public static customPicker: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    customcontrol: FBEditorCustomControl,
  };

  public static pickers: FBControlPickerDataProps = {
    section: ["section", "subsection", "stepsection", "teststep"],
    inputs: [
      "textfield",
      "checkbox",
      "checkboxgroup",
      "autocomplete",
      "texteditor",
      "datepicker",
      "hyperlink",
      "select",
      "radio",
      "radiogroup",
      "paragraph",
      "fileupload",
      "quantity",
      "timer",
      "purchaseorder",
      "approvalMatrix",
      "instructionsmediaupload",
      "evidencemediaupload",
      "testRequirement",
    ],
    approvals: ["hellosign", "approval", "inlineapproval"],
    customcontrols: ["customcontrol"],
    instructions: ["instructionsdocument", "selectdocument", "selectrequirement"],
    buttons: ["checkpoint", "createlabel"],
    actions: ["action"],
  };

  public static picker = (picker: FBInputType): React.ReactElement | undefined => {
    const customPicker = FBControlPickerState.customPicker[picker];
    if (!customPicker) {
      return;
    }
    return React.createElement(customPicker, {});
  };
}

export default FBControlPickerState;
