import FBBasicEditorProp from "../properties/FBBasicEditorProp";
import FBTextFieldEditorProp from "../properties/FBTextFieldEditorProp";
import { FBBasicFieldEditorEl } from "./types";

export const FBBasicFieldEditorComponent: FBBasicFieldEditorEl = {
  textfield: FBTextFieldEditorProp,
  checkbox: FBBasicEditorProp,
  checkboxgroup: FBBasicEditorProp,
};
