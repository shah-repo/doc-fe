import FBCheckboxEditor from "../components/editors/FBCheckboxEditor";
import FBCheckboxGroupEditor from "../components/editors/FBCheckboxGroupEditor";
import FBLabelEditor from "../components/editors/FBLabelEditor";
import FBTextFieldEditor from "../components/editors/FBTextFieldEditor";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import FBDatePicker from "../components/inputs/FBDatePicker";
import FBTextEditorField from "../components/inputs/FBTextEditorField";
import FBTextField from "../components/inputs/FBTextField";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBEditorElementType } from "../types/editor";

export interface FBEditorDict {
  [key: string]: React.FunctionComponent<{}>;
}

export const FBFieldEditorComponent: {
  [key: string]: React.FunctionComponent<{}>;
} = {
  section: FBLabelEditor,
  textfield: FBTextFieldEditor,
  checkbox: FBCheckboxEditor,
  checkboxgroup: FBCheckboxGroupEditor,
  datepicker: FBLabelEditor,
  texteditor: FBLabelEditor,
};

export const FBFieldComponent: { [key: string]: any } = {
  section: FBSectionBox,
  textfield: FBTextField,
  checkbox: FBCheckbox,
  checkboxgroup: FBCheckboxGroup,
  datepicker: FBDatePicker,
  texteditor: FBTextEditorField,
};

export const FBGroupField: { [key: string]: any } = {
  checkboxgroup: FBCheckbox,
};

export const FBEditorSectionConfig: { [key: string]: FBEditorElementType[] } = {
  section: ["section"],
  basics: ["textfield", "checkbox", "checkboxgroup", "texteditor", "datepicker"],
  lists: [],
};
