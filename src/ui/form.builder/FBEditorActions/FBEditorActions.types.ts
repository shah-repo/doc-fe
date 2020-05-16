import { ButtonProps } from "@material-ui/core";
import { FBFormState, FBInputProps, FBValidationProps } from "..";

export type FBEditorActionsProps =
& Pick<FBInputProps, "type" | "index" | "stringToOptions">
& FBValidationProps
& {
  handleAdd?: ButtonProps["onClick"];
  handleCancel?: ButtonProps["onClick"];
  parentFormState?: FBFormState;
};
