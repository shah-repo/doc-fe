import FBCheckbox from "../../../components/inputs/checkbox/FBCheckbox";
import FBTextField from "../../../components/inputs/textfield/FBTextField";
import FBCheckboxEditorConfig from "../configs/FBCheckboxEditorConfig";
import FBTextFieldEditorConfig from "../configs/FBTextFieldEditorConfig";
import { FBBasicFieldEditorEl } from "./types";

export const FBBasicFieldEditorComponent: FBBasicFieldEditorEl = {
  textfield: FBTextFieldEditorConfig,
  checkbox: FBCheckboxEditorConfig,
  checkboxgroup: FBTextFieldEditorConfig,
};

export const FieldComponent: FBBasicFieldEditorEl = {
  textfield: FBTextField,
  checkbox: FBCheckbox,
  checkboxgroup: FBCheckbox,
};
