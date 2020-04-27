import { FBControlPickerDataProps } from "..";

export class FBControlPickerState {
  public static config: FBControlPickerDataProps = {
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
    buttons: ["checkpoint", "createlabel"],
    instructions: ["instructionsdocument", "selectdocument", "selectrequirement"],
    actions: ["action"],
  };
}

export default FBControlPickerState;
