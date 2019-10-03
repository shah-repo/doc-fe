import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  FBOnChangeProps,
} from "./common";

export type FBTextFieldInjectedProps = Pick<OutlinedTextFieldProps, "variant">;

export type FBTextFieldProps =
  OutlinedTextFieldProps &
  FBFormDefaultProps &
  FBLabelRendererProps &
  FBOnChangeProps &
  FormikHybridFieldProps;
