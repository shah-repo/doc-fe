import { SelectProps } from "@material-ui/core/Select";
import { BaseTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { DocumentRevisionType } from "../../../../../state/ducks/documentRevisions";

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

export interface FBStateProps {
  name: string;
  documentType: DocumentRevisionType | null;
}

export interface FBStoreProps {
  state: FBStateProps;
  getState: (key: keyof FBStateProps) => any;
  setState: (key: keyof FBStateProps, value: any) => any;
  setStates: (props: FBStateProps) => any;
  removeState: (key: keyof FBStateProps) => any;
  clearStates: () => any;
}
