import { Dictionary } from "lodash";
import { FBAutocomplete, FBMediaAlbumField, FBParagraph } from "..";
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
import FBEditorParagraph from "../FBEditorParagraph/FBEditorParagraph";
import FBEditorSectionNumbering from "../FBEditorSectionNumbering";
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
  purchaseorder: FBLabelEditor,
  paragraph: FBEditorParagraph,
  sectionnumbering: FBEditorSectionNumbering,
  instructionsmediaupload: FBLabelEditor,
  evidencemediaupload: FBLabelEditor,
  checkpoint: FBLabelEditor,
  pause: FBLabelEditor,
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
  autocomplete: FBAutocomplete,
  hyperlink: FBLink,
  fileupload: FBFileUpload,
  schemaSelect: FBValidatorSchemaSelect,
  schemaItem: FBValidatorSchemaItem,
  action: FBActionContainer,
  purchaseorder: FBPurchaseOrderField,
  paragraph: FBParagraph,
  sectionnumbering: FBSectionBox,
  instructionsmediaupload: FBMediaAlbumField,
  evidencemediaupload: FBMediaAlbumField,
  checkpoint: FBButton,
  pause: FBButton,
};

export const FBEditorSectionConfig: Dictionary<FBEditorElementType[]> = {
  section: ["section", "subsection", "sectionnumbering"],
  representation: ["paragraph"],
  basics: [
    "textfield",
    "checkbox",
    "checkboxgroup",
    "texteditor",
    "datepicker",
    "hyperlink",
    "select",
    "radio",
    "radiogroup",
    "fileupload",
    "purchaseorder",
    "instructionsmediaupload",
    "evidencemediaupload",
  ],
  buttons: ["checkpoint", "pause"],
  lists: ["autocomplete"],
  actions: ["action"],
};

export const FBGroupEditorOptions: Dictionary<any[]> = {
  autocomplete: [{ value: "multiple", text: "form.builder.multi.select" }],
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
  "checkpoint",
  "pause",
];

export const pickDefaultLabel: FBEditorElementType[] = [
  "checkpoint",
  "pause",
];
