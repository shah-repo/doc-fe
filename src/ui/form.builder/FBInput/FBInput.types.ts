import { BaseTextFieldProps } from "@material-ui/core";
import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { FBEditorPropertiesType, FBInputState, FBLabelProps, FBOptionProps } from "..";

export type FBInputType =
  | "url"
  | "number"
  | "textfield"
  | "checkbox"
  | "checkboxgroup"
  | "section"
  | "subsection"
  | "datepicker"
  | "texteditor"
  | "select"
  | "radio"
  | "radiogroup"
  | "autocomplete"
  | "autocompleteasync"
  | "hyperlink"
  | "fileupload"
  | "schemaSelect"
  | "schemaItem"
  | "action"
  | "summarysection"
  | "editoroptions"
  | "schemaselect";

export type FBValidationMode = "disabled" | "visibility";

export type FBInputProps =
& FBLabelProps
& FBOptionProps
& Pick<AutocompleteProps, "multiple">
& Pick<BaseTextFieldProps,
| "children"
| "error"
| "value"
| "disabled"
| "name"
| "helperText"
| "rows"
| "placeholder"
| "defaultChecked"
| "hidden"
> & {
  onChange?: (ev: React.ChangeEvent<any> | any, value: any) => any;
  type?: FBInputType;
  index?: number;
  gutter?: boolean;
  linkUrl?: string;
  defaultValue?: any;
  inputState?: FBInputState;
  editorProperties?: FBEditorPropertiesType[];
  includeContext?: boolean;
  rules?: string;
  validationMode?: FBValidationMode;
  includeSelectedSchema?: boolean;
};

export const OmitInputClones: FBInputType[] = ["fileupload"];
