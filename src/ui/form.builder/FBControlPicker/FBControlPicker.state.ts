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
      "checkboxgroup",
      "autocomplete",
      "texteditor",
      "datepicker",
      "hyperlink",
      "select",
      "radiogroup",
      "paragraph",
      "fileupload",
      "quantity",
      "timer",
      "documentRevisions",
      "approvers",
      "purchaseorder",
      "poreceive",
      "approvalMatrix",
      "poApprovalMatrix",
      "instructionsmediaupload",
      "evidencemediaupload",
      "testRequirement",
    ],
    approvals: ["hellosign", "approval", "requestapproval"],
    customcontrols: ["customcontrol"],
    instructions: ["instructionsdocument", "selectdocument", "selectrequirement"],
    buttons: ["checkpoint", "createlabel"],
    actions: ["action"],
  };

  public static picker = (picker: FBInputType, index: number): React.ReactElement | undefined => {
    const customPicker = FBControlPickerState.customPicker[picker];
    if (!customPicker) {
      return;
    }
    return React.createElement(customPicker, { index });
  };
}

export default FBControlPickerState;
