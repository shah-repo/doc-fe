import { SelectProps } from "@material-ui/core/Select";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { FBEditorElementType } from "./editor";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: React.ReactNode;
}

export interface FBOptionRendererProps {
  optionsRenderer?: React.ReactNode[];
}

export type FBFormDefaultProps =
  & FBLabelRendererProps
  & FBOptionRendererProps
  & {
  name?: string;
  index?: number;
  type?: FBEditorElementType | string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  gutter?: boolean;
  options?: SelectOption[] | string;
  includeOther?: boolean;
  includeNote?: boolean;
  optionNote?: string;
  autocompleteList?: string;
  isMulti?: boolean;
  fieldName?: string;
  linkUrl?: string;
};

export type FBOnChangeProps =
  & FormikHybridFieldProps
  & Pick<SelectProps, "onChange" | "value">
  & Pick<OutlinedTextFieldProps, "onChange">
  & {
    value?: any;
    onChange: () => (trigger: React.ChangeEvent<HTMLInputElement> | Date) => any;
  };
