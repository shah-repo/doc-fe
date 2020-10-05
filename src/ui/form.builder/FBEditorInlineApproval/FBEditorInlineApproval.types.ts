import { FBEditorProps, FBInputProps } from "..";

export type FBEditorInlineApprovalProps =
& FBEditorProps
& Pick<FBInputProps, "defaultValue">
& {
  includeLabel?: boolean;
};
