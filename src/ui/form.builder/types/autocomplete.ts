import { BaseTextFieldProps } from "@material-ui/core/TextField";
import { HTMLAttributes } from "react";
import { SelectComponents } from "react-select/src/components";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { ValueType } from "react-select/src/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { FBFormDefaultProps, FBOnChangeProps } from "./common";

export type InputComponentProps =
  & Pick<BaseTextFieldProps, "inputRef">
  & HTMLAttributes<HTMLDivElement>;

export type MuiPlaceholderProps =
  & Omit<PlaceholderProps<SelectOption>, "innerProps">
  & Partial<Pick<PlaceholderProps<SelectOption>, "innerProps">>;

export interface FBAutocompleteInjectedProps {
  isMulti: boolean;
  components: Partial<SelectComponents<SelectOption>>;
  multi?: ValueType<SelectOption>;
}

export interface FBAutocompleteConfig {
  id: string;
  url: string;
  label: string;
  renderKey: string;
}

export type FBAutocompleteProps =
  & FBAutocompleteInjectedProps
  & FBFormDefaultProps
  & FBOnChangeProps;
