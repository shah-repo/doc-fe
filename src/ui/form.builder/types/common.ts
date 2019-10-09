import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { Delta } from "quill";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: JSX.Element;
}

export type FBFormDefaultProps = FBLabelRendererProps & {
  label?: string;
  disabled?: boolean;
};

export type FBOnChangeProps =
  Pick<SelectProps, "onChange" | "value"> &
  Pick<OutlinedTextFieldProps, "onChange"> & {
    value?: any;
    onChange: () => (trigger: React.ChangeEvent<HTMLInputElement> | Date) => any;
  };
