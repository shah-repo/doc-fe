import { SelectProps } from "@material-ui/core/Select";
import { SelectOption } from "../../../../../components/forms/fields/Select";
import { FormikHybridFieldProps } from "../../../../../components/hoc/utils/types";
import { FBFormDefaultProps, FBLabelRendererProps } from "../../../common/utils/types";

export interface FBSelectInjectedProps extends FBLabelRendererProps  {
  variant: "outlined";
  emptyItem?: JSX.Element;
  items: JSX.Element[];
}

export type FBSelectProps =
  SelectProps &
  FBFormDefaultProps &
  FBSelectInjectedProps &
  FormikHybridFieldProps & {
  includeEmpty?: boolean;
  options: SelectOption[];
};
