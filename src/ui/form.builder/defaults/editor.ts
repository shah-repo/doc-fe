import { Dictionary } from "lodash";
import { FBInputType } from "..";
import FBLabelEditor from "../components/editors/FBLabelEditor";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBEditorElementType } from "../types/editor";

export const FBFieldEditorComponent: Dictionary<React.FunctionComponent<any>> = {
  section: FBLabelEditor,
  // subsection: FBLabelEditor,
  // textfield: FBTextFieldEditor,
  // checkbox: FBControlEditor,
  // checkboxgroup: FBControlGroupEditor,
  // datepicker: FBLabelStepperEditor,
  // texteditor: FBLabelStepperEditor,
  // select: FBSelectEditor,
  // radio: FBControlEditor,
  // radiogroup: FBControlGroupEditor,
  // autocomplete: FBAutocompleteEditor,
  // autocompleteasync: FBAutocompleteEditor,
  // hyperlink: FBHyperlinkEditor,
  // fileupload: FBLabelStepperEditor,
  // action: FBActionEditor,
  // hellosign: FBLabelEditor,
  // purchaseorder: FBLabelEditor,
  // poreceive: FBLabelEditor,
  // approvalMatrix: FBLabelEditor,
  // poApprovalMatrix: FBLabelEditor,
  // paragraph: FBEditorParagraph,
  // stepsection: FBLabelEditor,
  // teststep: FBLabelEditor,
  // instructionsmediaupload: FBLabelEditor,
  // evidencemediaupload: FBLabelEditor,
  // checkpoint: FBLabelEditor,
  // approval: FBEditorApprovalField,
  // createlabel: FBLabelEditor,
  // quantity: FBLabelEditor,
  // timer: FBLabelEditor,
  // inlineapproval: FBEditorRequestApproval,
  // instructionsdocument: FBEditorInstructionsDocument,
  // selectdocument: FBEditorSelectDocument,
  // selectrequirement: FBEditorSelectRequirement,
  // testRequirement: FBEditorTestRequirement,
};

export const FBFieldComponent: Dictionary<any> = {
  section: FBSectionBox,
  // subsection: FBSubSectionBox,
  // textfield: FBTextField,
  // checkbox: FBCheckbox,
  // checkboxgroup: FBCheckboxGroup,
  // datepicker: FBDatePicker,
  // texteditor: FBTextEditorField,
  // select: FBSelect,
  // radio: FBRadio,
  // radiogroup: FBRadioGroup,
  // autocomplete: FBAutocompleteAsync,
  // autocompleteasync: FBAutocompleteAsync,
  // hyperlink: FBLink,
  // fileupload: FBFileUpload,
  // schemaSelect: FBValidatorSchemaSelect,
  // schemaItem: FBValidatorSchemaItem,
  // action: FBActionContainer,
  // hellosign: FBHelloSign,
  // approvalMatrix: FBApprovalMatrix,
  // poApprovalMatrix: FBPOApprovalMatrix,
  // purchaseorder: FBPurchaseOrder,
  // poreceive: FBPOReceive,
  // paragraph: FBParagraph,
  // stepsection: FBSectionBox,
  // teststep: FBSectionBox,
  // instructionsmediaupload: FBMediaAlbumField,
  // evidencemediaupload: FBMediaAlbumField,
  // checkpoint: FBButton,
  // approval: FBApproval,
  // createlabel: FBButton,
  // quantity: FBQuantityField,
  // timer: FBTimerField,
  // instructionsdocument: FBInstructionsDocument,
  // selectdocument: FBSelectDocument,
  // selectrequirement: FBSelectRequirement,
  // testRequirement: FBTestRequirement,
};

export const FBEditorSectionConfig: Dictionary<FBInputType[]> = {
  section: ["section", "subsection", "stepsection", "teststep"],
  basics: [
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
    "poreceive",
    "documentRevisions",
    "approvalMatrix",
    "poApprovalMatrix",
    "instructionsmediaupload",
    "evidencemediaupload",
    "testRequirement",
  ],
  approvals: ["hellosign", "approval"],
  buttons: ["checkpoint", "createlabel"],
  instructions: ["instructionsdocument", "selectdocument", "selectrequirement"],
  actions: ["action"],
};

export const FBGroupEditorOptions: Dictionary<any[]> = {
  autocomplete: [
    { value: "multiple", text: "form.builder.multi.select" },
    { value: "includeQRScan", text: "form.builder.include.qr.scan" },
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  mediaupload: [
    { value: "isTemplate", text: "form.builder.is.template" },
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  select: [
    { value: "includeNone", text: "form.builder.include.none" },
    { value: "includeContext", text: "form.builder.include.other" },
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  control: [
    { value: "includeContext", text: "form.builder.include.note" },
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  controlgroup: [
    { value: "includeContext", text: "form.builder.include.other" },
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  textfield: [
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  label: [
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
  approval: [
    { value: "approveIsBlocking", text: "form.builder.blocking" },
    { value: "reviseDisabled", text: "form.builder.revise.disabled" },
  ],
};

export const omitReviseDisabledOption: string[] = [
  "section",
  "subsection",
];

export const omitLabelValidation: FBEditorElementType[] = [
  "action",
  "paragraph",
  "instructionsmediaupload",
  "evidencemediaupload",
  "instructionsdocument",
];

export const pickDefaultLabel: FBEditorElementType[] = [
  "checkpoint",
  "approval",
  "inlineapproval",
  "createlabel",
  "quantity",
  "stepsection",
  "teststep",
  "instructionsdocument",
  "selectdocument",
  "selectrequirement",
  "testRequirement",
  "instructionsmediaupload",
  "evidencemediaupload",
];
