import { SelectProps } from "@material-ui/core/Select";
import { SelectOption } from "../../../../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../../../../components/hoc/utils/types";

export interface FBSelectInjectedProps  {
  variant: "outlined";
  labelRenderer?: JSX.Element;
  emptyItem?: JSX.Element;
  items: JSX.Element[];
}

export type FBSelectProps = SelectProps & FBSelectInjectedProps & FormikHybridFieldProps & {
  label?: string;
  includeEmpty?: boolean;
  options: SelectOption[];
};
