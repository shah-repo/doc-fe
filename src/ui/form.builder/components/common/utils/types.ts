import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { DocumentRevisionType } from "../../../../../state/ducks/documentRevisions";
import { FBBasicFieldEditorType } from "../../../main/editor/utils/types";
import { FBTemplateStore } from "../../../stores/utils/types";

export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps {
  labelRenderer?: JSX.Element;
}

export type FBFormDefaultProps = FBLabelRendererProps & {
  label?: string;
};

export type FBOnChangeProps =
  Pick<SelectProps, "onChange" | "value"> &
  Pick<OutlinedTextFieldProps, "onChange"> &
  Pick<BaseTextFieldProps, "value">;
