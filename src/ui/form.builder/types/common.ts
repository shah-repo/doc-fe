import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { ValueType } from "react-select/src/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { FBEditorElementType } from "./editor";
import { FBValidatorDelimiter } from "./validation/validator";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: React.ReactNode;
}

export interface FBOptionRendererProps {
  optionsRenderer?: React.ReactNode[];
}

export type FBFormDefaultProps =
  & Pick<BaseTextFieldProps, "children" | "disabled" | "name">
  & FBLabelRendererProps
  & FBOptionRendererProps
  & {
    index?: number;
    type?: FBEditorElementType | string;
    label?: string | React.ReactNode;
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
  };

export type FBOnChangeType =
  | React.ChangeEvent<HTMLInputElement>
  | ValueType<SelectOption>
  | string
  | Date;

export type FBOnChangeProps =
  & FormikHybridFieldProps
  & Pick<SelectProps, "onChange" | "value">
  & Pick<OutlinedTextFieldProps, "onChange">
  & Pick<FBFormDefaultProps, "validatorDelimiter">
  & {
    value?: any;
    onChange?: (trigger: any) => void;
  };
