import FBCheckboxEditor from "../components/editors/FBCheckboxEditor";
import FBTextFieldEditor from "../components/editors/FBTextFieldEditor";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBTextField from "../components/inputs/FBTextField";
import { FBEditorElementType } from "../types/editor";
import FBSectionBox from "../components/layout/FBSectionBox";
import FBSectionEditor from "../components/editors/FBSectionEditor";
import FBTextEditor from "../components/editors/FBTextEditor";
import FBTextEditorField from "../components/inputs/FBTextEditorField";

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
  texteditor: FBTextEditor,
};

export const FBFieldComponent: { [key: string]: any } = {
  section: FBSectionBox,
  textfield: FBTextField,
  checkbox: FBCheckbox,
  checkboxgroup: FBCheckbox,
  texteditor: FBTextEditorField,
};

export const FBEditorSectionConfig: { [key: string]: FBEditorElementType[] } = {
  section: ["section"],
  basics: ["textfield", "checkbox", "checkboxgroup", "texteditor"],
  lists: [],
};
