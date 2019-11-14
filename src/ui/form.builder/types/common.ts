import { SelectProps } from "@material-ui/core/Select";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { ValueType } from "react-select/src/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { FBEditorElementType } from "./editor";
import { FBTemplateSchema } from "./store";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: React.ReactNode;
}

export interface FBOptionRendererProps {
  optionsRenderer?: React.ReactNode[];
}

export interface FBShemaArrayProps {
  schema?: Array<Partial<FBTemplateSchema>>;
}

export type FBFormDefaultProps =
  & FBLabelRendererProps
  & FBShemaArrayProps
  & FBOptionRendererProps
  & {
    placeholder?: string;
    name?: string;
    index?: number;
    type?: FBEditorElementType | string;
    label?: string;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    gutter?: boolean;
    options?: SelectOption[] | string | string[];
    includeOther?: boolean;
    includeNote?: boolean;
    optionNote?: string;
    autocompleteValue?: string;
    isMulti?: boolean;
    fieldName?: string;
    linkUrl?: string;
    validatorGroup?: string;
    row?: boolean;
  };

export type FBOnChangeType =
  | React.ChangeEvent<HTMLInputElement>
  | ValueType<SelectOption>
  | string
  | Date;

export type FBOnChangeProps = FormikHybridFieldProps &
  Pick<SelectProps, "onChange" | "value"> &
  Pick<OutlinedTextFieldProps, "onChange"> & {
    value?: any;
    onChange?: (trigger: any) => void;
  };
