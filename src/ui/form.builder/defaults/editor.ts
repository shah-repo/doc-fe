import { Dictionary } from "lodash";
import FBAutocompleteEditor from "../components/editors/FBAutocompleteEditor";
import FBControlEditor from "../components/editors/FBControlEditor";
import FBControlGroupEditor from "../components/editors/FBControlGroupEditor";
import FBHyperlinkEditor from "../components/editors/FBHyperlinkEditor";
import FBLabelEditor from "../components/editors/FBLabelEditor";
import FBLabelStepperEditor from "../components/editors/FBLabelStepperEditor";
import FBSelectEditor from "../components/editors/FBSelectEditor";
import FBTextFieldEditor from "../components/editors/FBTextFieldEditor";
import FBValidatorEditor from "../components/editors/FBValidatorEditor";
import FBValidator from "../components/feedback/FBValidator";
import FBAutocomplete from "../components/inputs/FBAutocomplete";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import FBDatePicker from "../components/inputs/FBDatePicker";
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
import { FBEditorElementType } from "../types/editor";

export const FBFieldEditorComponent: Dictionary<React.FunctionComponent<{}>> = {
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
};

export const FBGroupField: Dictionary<any>  = {
  checkboxgroup: FBCheckbox,
  radiogroup: FBRadio,
};

export const FBEditorSectionConfig: Dictionary<FBEditorElementType[]> = {
  section: ["section", "subsection"],
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
  ],
  lists: ["autocomplete"],
};
