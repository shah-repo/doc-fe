import { KeyboardDatePickerProps } from "@material-ui/pickers/DatePicker/DatePicker";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  FBOnChangeProps,
} from "./common";

export type FBDatePickerProps =
  & KeyboardDatePickerProps
  & FBFormDefaultProps
  & FBLabelRendererProps
  & FBOnChangeProps
  & FormikHybridFieldProps;
