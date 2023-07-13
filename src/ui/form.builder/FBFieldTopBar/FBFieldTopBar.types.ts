import { FBEditorHelperProps, FBInputProps } from '..';

export type FBFieldTopBarProps =
  & FBEditorHelperProps
  & {
    editSchemaItem?: () => void
    removeSchemaItem?: () => void
    toggleItemMarkdown?: () => void
    inputProps?: Partial<FBInputProps>
  };
