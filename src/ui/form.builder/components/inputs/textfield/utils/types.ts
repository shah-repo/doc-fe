import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { FormikHybridFieldProps } from "../../../../../components/hoc/utils/types";
import { FBFormDefaultProps, FBLabelRendererProps } from "../../../common/utils/types";

export interface FBTextFieldInjectedProps extends FBLabelRendererProps {
  variant: "outlined";
}

export type FBTextFieldProps =
  OutlinedTextFieldProps &
  FBFormDefaultProps &
  FBTextFieldInjectedProps &
  FormikHybridFieldProps;
