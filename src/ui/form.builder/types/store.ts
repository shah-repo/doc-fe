
import { SelectOption } from "../../components/forms/fields/Select";
import { FBInputProps, FBLabelProps } from "./common";
import { FBContextProps } from "./common/context";
import { FBEditorElementType } from "./editor";
import { FBDocumentFlowProps } from "./formik";
import { FBValidatorDelimiter, FBValidatorTrigger } from "./validation/validator";

export type FBSchema =
  & Pick<FBInputProps, "index" | "name" | "type" | "disabled" | "rows">
  & FBLabelProps
  & Pick<FBContextProps, "includeContext" | "contextLabel">;

export interface FBTemplateSchema {
  type: FBEditorElementType | string;
  name: string;
  index: number;
  label: string;
  placeholder?: string;
  rows?: number;
  checkboxNote?: string;
  disabled?: boolean;
  includeOther?: boolean;
  options?: string | string[] | SelectOption[];
  includeNote?: boolean;
  optionNote?: string;
  autocompleteId?: string;
  isMulti?: boolean;
  linkUrl?: string;
  rules?: string;
  validatorDelimiter?: FBValidatorDelimiter;
  hasSchemaItem?: boolean;
  fieldName?: string;
  applicableOn?: FBValidatorTrigger[];
}

export type FBDRGroupConfig =
  & Pick<FBDocumentFlowProps, "formInput">
  & {
  docRevMode: FBDocumentRevisionMode;
  schema: FBTemplateSchema[];
};

export type FBDocumentRevisionMode =
  | "none"
  | "create"
  | "update"
  | "preview"
  | "outputCreate"
  | "outputPreview";
