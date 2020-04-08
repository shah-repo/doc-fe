import { Dictionary } from "lodash";
import { FBAutocompleteAsync, FBEditorInstructionsDocument, FBEditorSelectDocument, FBMediaAlbumField, FBParagraph, FBQuantityField, FBSelectDocument, FBTimerField } from "..";
import FBActionContainer from "../components/actions/FBActionContainer";
import FBActionEditor from "../components/editors/FBActionEditor";
import FBAutocompleteEditor from "../components/editors/FBAutocompleteEditor";
import FBControlEditor from "../components/editors/FBControlEditor";
import FBControlGroupEditor from "../components/editors/FBControlGroupEditor";
import FBHyperlinkEditor from "../components/editors/FBHyperlinkEditor";
import FBLabelEditor from "../components/editors/FBLabelEditor";
import FBLabelStepperEditor from "../components/editors/FBLabelStepperEditor";
import FBSelectEditor from "../components/editors/FBSelectEditor";
import FBTextFieldEditor from "../components/editors/FBTextFieldEditor";
import FBButton from "../components/inputs/FBButton";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import FBDatePicker from "../components/inputs/FBDatePicker";
import FBPurchaseOrderField from "../components/inputs/FBPurchaseOrderField";
import FBRadio from "../components/inputs/FBRadio";
import FBRadioGroup from "../components/inputs/FBRadioGroup";
import FBSelect from "../components/inputs/FBSelect";
import FBTextEditorField from "../components/inputs/FBTextEditorField";
import FBTextField from "../components/inputs/FBTextField";
import FBSectionBox from "../components/layout/FBSectionBox";
import FBSubSectionBox from "../components/layout/FBSubSectionBox";
import FBFileUpload from "../components/navigation/FBFileUpload";
import FBLink from "../components/navigation/FBLink";
import FBValidatorSchemaItem from "../components/validation/FBValidatorSchemaItem";
import FBValidatorSchemaSelect from "../components/validation/FBValidatorSchemaSelect";
import FBApprovalField from "../FBApprovalField/FBApprovalField";
import FBEditorApprovalField from "../FBEditorApprovalField";
import FBEditorInlineApproval from "../FBEditorInlineApproval";
import FBEditorParagraph from "../FBEditorParagraph/FBEditorParagraph";
import FBEditorStepSection from "../FBEditorStepSection";
import FBHelloSign from "../FBHelloSign";
import FBInlineApproval from "../FBInlineApproval";
import FBInstructionsDocument from "../FBInstructionsDocument";
import { FBEditorElementType } from "../types/editor";

export const FBFieldEditorComponent: Dictionary<React.FunctionComponent<any>> = {
  section: FBLabelEditor,
  subsection: FBLabelEditor,
  textfield: FBTextFieldEditor,
  checkbox: FBControlEditor,
  checkboxgroup: FBControlGroupEditor,
  datepicker: FBLabelStepperEditor,
  texteditor: FBLabelStepperEditor,
  select: FBSelectEditor,
  radio: FBControlEditor,
  radiogroup: FBControlGroupEditor,
  autocomplete: FBAutocompleteEditor,
  hyperlink: FBHyperlinkEditor,
  fileupload: FBLabelStepperEditor,
  action: FBActionEditor,
  hellosign: FBLabelEditor,
  purchaseorder: FBLabelEditor,
  paragraph: FBEditorParagraph,
  stepsection: FBEditorStepSection,
  instructionsmediaupload: FBLabelEditor,
  evidencemediaupload: FBLabelEditor,
  checkpoint: FBLabelEditor,
  approval: FBEditorApprovalField,
  createlabel: FBLabelEditor,
  quantity: FBLabelEditor,
  timer: FBLabelEditor,
  inlineapproval: FBEditorInlineApproval,
  instructionsdocument: FBEditorInstructionsDocument,
  selectdocument: FBEditorSelectDocument,
};

export const FBFieldComponent: Dictionary<any> = {
  section: FBSectionBox,
  subsection: FBSubSectionBox,
  textfield: FBTextField,
  checkbox: FBCheckbox,
  checkboxgroup: FBCheckboxGroup,
  datepicker: FBDatePicker,
  texteditor: FBTextEditorField,
  select: FBSelect,
  radio: FBRadio,
  radiogroup: FBRadioGroup,
  autocomplete: FBAutocompleteAsync,
  hyperlink: FBLink,
  fileupload: FBFileUpload,
  schemaSelect: FBValidatorSchemaSelect,
  schemaItem: FBValidatorSchemaItem,
  action: FBActionContainer,
  hellosign: FBHelloSign,
  purchaseorder: FBPurchaseOrderField,
  paragraph: FBParagraph,
  stepsection: FBSectionBox,
  instructionsmediaupload: FBMediaAlbumField,
  evidencemediaupload: FBMediaAlbumField,
  checkpoint: FBButton,
  approval: FBApprovalField,
  createlabel: FBButton,
  quantity: FBQuantityField,
  timer: FBTimerField,
  inlineapproval: FBInlineApproval,
  instructionsdocument: FBInstructionsDocument,
  selectdocument: FBSelectDocument,
};

export const FBEditorSectionConfig: Dictionary<FBEditorElementType[]> = {
  section: ["section", "subsection", "stepsection"],
  representation: ["paragraph"],
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
    "fileupload",
    "quantity",
    "timer",
    "purchaseorder",
    "instructionsmediaupload",
    "evidencemediaupload",
    "inlineapproval",
  ],
  approvals: ["hellosign"],
  instructions: ["instructionsdocument", "selectdocument"],
  buttons: ["checkpoint", "approval", "createlabel"],
  actions: ["action"],
};

export const FBGroupEditorOptions: Dictionary<any[]> = {
  autocomplete: [
    { value: "multiple", text: "form.builder.multi.select" }, {
      value: "includeQRScan", text: "form.builder.include.qr.scan",
    },
  ],
  mediaupload: [{ value: "isTemplate", text: "form.builder.is.template" }],
  select: [
    { value: "includeNone", text: "form.builder.include.none" },
    { value: "includeContext", text: "form.builder.include.other" },
  ],
  control: [{ value: "includeContext", text: "form.builder.include.note" }],
  controlgroup: [
    { value: "includeContext", text: "form.builder.include.other" },
  ],
};

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
  "instructionsdocument",
  "selectdocument",
];
