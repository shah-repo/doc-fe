import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { ValueType } from "react-select/src/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { FBEditorElementType } from "./editor";
import { FBValidatorDelimiter, FBValidatorTrigger } from "./validation/validator";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: React.ReactNode;
}

export interface FBOptionRendererProps {
  optionsRenderer?: React.ReactNode[];
}

export interface FBLabelProps {
  label?: string | React.ReactNode;
}

export interface FBOptionProps {
  options?: any[] | string;
  optionLabelKey?: string;
  optionValueKey?: string;
  includeNone?: boolean;
}

export type FBInputProps =
  & Pick<BaseTextFieldProps, "children" | "disabled" | "name" | "error" | "helperText">
  & FBLabelProps
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
