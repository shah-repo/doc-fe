import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { FBFormDefaultProps, FBOnChangeProps } from "./common";

export type FBTextFieldProps =
    Omit<OutlinedTextFieldProps, "variant"> &
    FBFormDefaultProps &
    FBOnChangeProps;
