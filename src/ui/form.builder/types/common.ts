import { BoxProps } from "@material-ui/core/Box/Box";
import { FormControlProps } from "@material-ui/core/FormControl/FormControl";
import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { Dictionary } from "lodash";
import { ReactNode } from "react";
import { ValueType } from "react-select/src/types";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { FBValidationModeType } from "../FBValidationMode";
import { FBActionContainerProps } from "./actions/action";
import { FBContextProps } from "./common/context";
import { FBEditorElementType } from "./editor";
import { FBFormikFieldProps } from "./formik";
import { FBValidatorDelimiter, FBValidatorTrigger } from "./validation/validator";
import { FBValidatorConfigProps } from "./validation/validatorDialog";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: React.ReactNode;
}

export interface FBOptionRendererProps {
  optionsRenderer?: React.ReactNode[];
}

export enum FBLabelFontSize {
  sm = "subtitle1",
  md = "h6",
  lg = "h5",
}

export type FBLabelProps =
  & Pick<FormControlProps, "error">
  & Pick<BoxProps, "m" | "mb" | "ml" | "mr" | "mt" | "mx" | "my" | "p" | "pb" | "pl" | "pr" | "pt" | "px" | "py">
  & {
    label?: string | ReactNode;
    fontSize?: "sm" | "md" | "lg";
    loading?: boolean;
    isFullWidth?: boolean;
  };

export type FBOptionProps =
  & Omit<FBFormikFieldProps, "name">
  & Pick<FBContextProps, "includeContext">
  & Pick<BaseTextFieldProps, "name" | "type">
  & {
    options?: any[] | string;
    optionId?: string;
    optionPath?: string;
    optionLabelKey?: string;
    optionValueKey?: string;
    includeNone?: boolean;
    value?: any;
    optionObjectKeys?: string[];
    optionValueType?:  "object" | "key";
  };

export type FBInputProps = Omit<FBFormikFieldProps, "name">
& FBLabelProps
& Pick<FBContextProps, "includeContext" | "showContext" | "contextLabel">
& Pick<SelectProps, "renderValue">
// & Pick<FBValidatorProps, "rules" | "applicableOn">
& Pick<FBActionContainerProps, "actions">
& Pick<FBOptionProps,
| "optionId"
| "options"
| "optionValueKey"
| "optionLabelKey"
| "optionObjectKeys"
| "optionValueType"
 >
& Pick<BaseTextFieldProps,
| "children"
| "value"
| "disabled"
| "name"
| "helperText"
| "defaultValue"
| "rows"
| "placeholder"
| "hidden"
| "fullWidth"
>
& {
  index?: number;
  type?: FBEditorElementType | string;
  linkUrl?: string;
  onChange?: (e: any, value: any) => void;
  afterChange?: (
    fieldName: string,
    value: any,
    values: Dictionary<any>,
  ) => void;
  rules?: string;
  applicableIn?: string[];
  checked?: boolean;
  validatorFieldName?: string;
  hasSchemaItem?: boolean;
  hasSchemaItems?: boolean;
  applicableOn?: any[];
  multiple?: boolean;
  customValidator?: FBValidatorConfigProps;
  gutter?: boolean;
  tooltip?: string;
  validationMode?: FBValidationModeType[];
  formValuesRules?: Dictionary<any>;
  templateId?: string;
  isTemplate?: boolean;
  hellosignFlowProps?: any;
  paragraph?: string;
  includeQRScan?: boolean;
  loading?: boolean;
  approvers?: string[] | Employee[];
  approverGroups?: string[] | GroupRequestBody[];
  approveIsBlocking?: boolean;
  instructionsDocument?: string;
  testRequirement?: string;
  approved?: boolean;
  designDisabled?: boolean;
  reviseDisabled?: boolean;
};

export type FBFormDefaultProps = FBInputProps &
FBLabelRendererProps &
FBOptionRendererProps & {
  index?: number;
  type?: FBEditorElementType | string;
  readOnly?: boolean;
  className?: string;
  gutter?: boolean;
  options?: SelectOption[] | string[] | string;
  includeOther?: boolean;
  includeNote?: boolean;
  optionNote?: string;
  autocompleteId?: string;
  isMulti?: boolean;
  linkUrl?: string;
  rules?: string;
  validatorDelimiter?: FBValidatorDelimiter;
  hasSchemaItem?: boolean;
  fieldName?: string;
  row?: boolean;
  applicableOn?: FBValidatorTrigger[];
};

export type FBOnChangeType =
  | React.ChangeEvent<HTMLInputElement>
  | ValueType<SelectOption>
  | string
  | Date;

export type FBOnChangeProps = FormikHybridFieldProps &
Pick<SelectProps, "onChange" | "value"> &
Pick<FBFormDefaultProps, "validatorDelimiter"> &
Pick<OutlinedTextFieldProps, "error" | "helperText"> & {
  value?: any;
  onChange?: (trigger: any) => void;
};
