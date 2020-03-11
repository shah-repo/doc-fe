
import { FormBuilderDynamicValidatorStore } from "../stores/ui/FBDynamicValidatorStore";
import { FBInputProps } from "./common";
import { FBDocumentFlowProps } from "./formik";

export type FBTemplateSchema = FBInputProps;
// & Pick<FBInputProps, "index" | "name" | "type" | "disabled" | "rows" | "placeholder">
// & FBLabelProps
// & Pick<FBContextProps, "includeContext" | "contextLabel">;

// export interface FBTemplateSchema {
//   type: FBEditorElementType | string;
//   name: string;
//   index: number;
//   label: string;
//   placeholder?: string;
//   rows?: number;
//   checkboxNote?: string;
//   disabled?: boolean;
//   includeOther?: boolean;
//   options?: string | string[] | SelectOption[];
//   includeNote?: boolean;
//   optionNote?: string;
//   autocompleteId?: string;
//   isMulti?: boolean;
//   linkUrl?: string;
//   rules?: string;
//   validatorDelimiter?: FBValidatorDelimiter;
//   hasSchemaItem?: boolean;
//   fieldName?: string;
//   applicableOn?: FBValidatorTrigger[];
// }

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
  | "outputUpdate"
  | "outputPreview";

export interface FBStoreProps {
  dynamicValidatorStore?: FormBuilderDynamicValidatorStore;
}
