import { TextFieldProps } from "@material-ui/core";
import { FBInputProps } from "../types/common";

export type FBQuantityProps =
& Pick<TextFieldProps, "id">
& Pick<FBInputProps, "name" | "label" | "value" | "placeholder" | "error" >;
