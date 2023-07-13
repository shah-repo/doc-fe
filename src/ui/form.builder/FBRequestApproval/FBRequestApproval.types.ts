import { FBEditorHelperProps, FBInputProps } from '..';

export type FBRequestApprovalProps =
& FBInputProps
& FBEditorHelperProps
& {
  handleAddEdit?: () => any
  isOutput?: boolean
};
