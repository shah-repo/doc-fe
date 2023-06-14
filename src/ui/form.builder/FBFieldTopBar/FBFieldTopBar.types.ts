import { FBEditorHelperProps, FBInputProps } from '..';

export type FBFieldTopBarProps =
  & FBEditorHelperProps
  & {
    editSchemaItem?: () => any
    removeSchemaItem?: () => any
    markDownSchemaItem?: () => any
    inputProps?: Partial<FBInputProps>
  };
