import { ButtonProps } from "@material-ui/core";
import { FBInputProps, FBValidationProps } from "..";

export type FBEditorActionsProps =
& Pick<FBInputProps, "type" | "index">
& FBValidationProps
& {
  onAddClick?: ButtonProps["onClick"];
  onCancelClick?: ButtonProps["onClick"];
};
