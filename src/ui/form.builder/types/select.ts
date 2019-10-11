import { SelectProps } from "@material-ui/core/Select";
import { SelectOption } from "../../components/forms/fields/Select";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  FBOnChangeProps,
} from "./common";

export interface FBSelectInjectedProps extends FBLabelRendererProps  {
  emptyItem?: JSX.Element;
  items: JSX.Element[];
}

export type FBSelectProps =
  SelectProps &
  FBFormDefaultProps &
  FBSelectInjectedProps &
  FBOnChangeProps & {
  includeEmpty?: boolean;
  showNote?: boolean;
  variant?: "outlined";
};
