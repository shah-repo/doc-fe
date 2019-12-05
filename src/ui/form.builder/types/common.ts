import { FormControlProps } from "@material-ui/core/FormControl/FormControl";
import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { ReactNode } from "react";
import { ValueType } from "react-select/src/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { TextProps } from "../../components/Text";
import { FBCheckContextProps } from "./common/checkcontext";
import { FBEditorElementType } from "./editor";
import { FBFormikFieldProps } from "./formik";
import { FBValidatorDelimiter, FBValidatorTrigger } from "./validation/validator";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: React.ReactNode;
}

export interface FBOptionRendererProps {
  optionsRenderer?: React.ReactNode[];
}

export type FBLabelProps =
  & Pick<FormControlProps, "error">
  & {
  label?: string | ReactNode;
  labelValues?: TextProps["values"];
};

export type FBOptionProps =
  & Pick<FBCheckContextProps, "includeContext">
  & {
  options?: any[] | string;
  optionLabelKey?: string;
  optionValueKey?: string;
  includeNone?: boolean;
};

export type FBInputProps =
  & Omit<FBFormikFieldProps, "name">
  & FBLabelProps
  & Pick<BaseTextFieldProps,
    | "children"
    | "value"
    | "disabled"
    | "name"
    | "helperText"
    | "defaultValue"
  >
  & {
    index?: number;
    type?: FBEditorElementType | string;
  };

export type FBFormDefaultProps =
  & FBInputProps
  & FBLabelRendererProps
  & FBOptionRendererProps
  & {
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

export type FBOnChangeProps =
  & FormikHybridFieldProps
  & Pick<SelectProps, "onChange" | "value">
  & Pick<FBFormDefaultProps, "validatorDelimiter">
  & Pick<OutlinedTextFieldProps, "error" | "helperText">
  & {
    value?: any;
    onChange?: (trigger: any) => void;
  };
