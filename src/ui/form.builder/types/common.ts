import { BoxProps } from "@material-ui/core/Box/Box";
import { FormControlProps } from "@material-ui/core/FormControl/FormControl";
import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { Dictionary } from "lodash";
import { ReactNode } from "react";
import { ValueType } from "react-select/src/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { TextProps } from "../../components/Text";
import { FBActionContainerProps } from "./actions/action";
import { FBContextProps } from "./common/context";
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
  labelValues?: TextProps["values"];
  fontSize?: "sm" | "md" | "lg";
};

export type FBOptionProps =
  & Pick<FBContextProps, "includeContext">
  & Pick<BaseTextFieldProps, "name">
  & {
  options?: any[] | string;
  optionId?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
  includeNone?: boolean;
};

export type FBInputProps =
  & Omit<FBFormikFieldProps, "name">
  & FBLabelProps
  & Pick<FBContextProps, "includeContext" | "showContext" | "contextLabel">
  // & Pick<FBValidatorProps, "rules" | "applicableOn">
  & Pick<FBActionContainerProps, "actions">
  & Pick<FBOptionProps, "optionId">
  & Pick<BaseTextFieldProps,
    | "children"
    | "value"
    | "disabled"
    | "name"
    | "helperText"
    | "defaultValue"
    | "rows"
    | "placeholder"
  >
  & {
    index?: number;
    type?: FBEditorElementType | string;
    linkUrl?: string;
    onChange?: (e: any, value: any) => void;
    afterChange?: (fieldName: string, value: any, values: Dictionary<any>) => void;
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
