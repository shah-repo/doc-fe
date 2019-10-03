import { SelectProps } from "@material-ui/core/Select";
import { SelectOption } from "../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
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
  FBOnChangeProps &
  FormikHybridFieldProps & {
  includeEmpty?: boolean;
  options: SelectOption[];
  variant?: "outlined";
};
