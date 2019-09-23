import { Omit } from "@material-ui/core";
import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { FormikHybridFieldProps } from "../../../../components/hoc/utils/types";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: JSX.Element;
}

export type FBFormDefaultProps = FBLabelRendererProps & {
  label?: string;
};

export type FBOnChangeProps =
  Pick<SelectProps, "onChange" | "value"> &
  Pick<BaseTextFieldProps, "onChange" | "value">;
