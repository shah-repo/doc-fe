import FBCheckboxEditor from "../components/editors/FBCheckboxEditor";
import FBSectionEditor from "../components/editors/FBSectionEditor";
import FBTextFieldEditor from "../components/editors/FBTextFieldEditor";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBDatePicker from "../components/inputs/FBDatePicker";
import FBTextField from "../components/inputs/FBTextField";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBEditorElementType } from "../types/editor";

export interface FBEditorDict {
  [key: string]: React.FunctionComponent<{}>;
}

export const FBFieldEditorComponent: {
  [key: string]: React.FunctionComponent<{}>;
} = {
  section: FBSectionEditor,
  textfield: FBTextFieldEditor,
  checkbox: FBCheckboxEditor,
  checkboxgroup: FBTextFieldEditor,
  datepicker: FBSectionEditor,
};

export const FBFieldComponent: { [key: string]: any } = {
  section: FBSectionBox,
  textfield: FBTextField,
  checkbox: FBCheckbox,
  checkboxgroup: FBCheckbox,
  datepicker: FBDatePicker,
};

export const FBEditorSectionConfig: { [key: string]: FBEditorElementType[] } = {
  section: ["section"],
  basics: ["textfield", "checkbox", "checkboxgroup", "datepicker"],
  lists: [],
};
