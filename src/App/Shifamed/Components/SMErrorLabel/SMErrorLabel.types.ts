import { SMInputProps } from "../../..";

export type SMErrorLabelProps =
& Pick<SMInputProps, "name">
& {
  error?: string;
};
