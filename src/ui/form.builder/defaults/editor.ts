import FBCheckboxEditor from "../components/editors/FBCheckboxEditor";
import FBTextFieldEditor from "../components/editors/FBTextFieldEditor";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBTextField from "../components/inputs/FBTextField";
import { FBEditorElementType } from "../types/editor";

export interface FBEditorDict {
  [key: string]: React.FunctionComponent<{}>;
}

export const FBFieldEditorComponent:
  { [key: string]: React.FunctionComponent<{}> } = {
  textfield: FBTextFieldEditor,
  checkbox: FBCheckboxEditor,
  checkboxgroup: FBTextFieldEditor,
};

export const FBFieldComponent: { [key: string]: any } = {
  textfield: FBTextField,
  checkbox: FBCheckbox,
  checkboxgroup: FBCheckbox,
};

export const FBEditorSectionConfig:
  { [key: string]: FBEditorElementType[]} = {
  section: [],
  basics: ["textfield", "checkbox", "checkboxgroup"],
  lists: [],
};

