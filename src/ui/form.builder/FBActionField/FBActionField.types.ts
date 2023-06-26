import { FBActionFieldState, FBDialogState, FBInputProps, FBSchemaProps } from '..';

export interface FBActionOptionProps {
  name?: string
  description?: string
  actionLabel?: string
  requestMethod?: string
  requestUrl?: string
  schema: FBSchemaProps[]
}

export type FBActionFieldProps =
& Pick<FBInputProps, 'name' | 'actions' | 'disabled'> & {
  handleAction?: (option: FBActionOptionProps) => any
  options?: FBActionOptionProps[]
  dialogState?: FBDialogState
};

export interface FBActionFieldActionsProps {
  handleRequest?: () => any
  handleCancel?: () => any
  actionFieldState?: FBActionFieldState
  requestUrl?: string
}
