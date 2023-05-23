import { FBEditorState, FBFormProps, FBInputProps, FBProviderProps } from '..';
import { TabInfo } from '../../../state/ducks/documentRevisions/documentType/types';

export type FBEditorMode = 'config' | 'validation';

export interface FBEditorModeProps {
  mode: FBEditorMode
  label: string
}

export type FBEditorProps =
& Pick<FBFormProps, 'children'>
& Pick<FBProviderProps, 'formState'>
& {
  mode?: FBEditorMode
  editorState?: FBEditorState
  underValidation?: boolean
  includeDefaultValue?: boolean
  inputProps?: FBInputProps
  standalone?: boolean
  isFormOutput?: boolean
  tabConfig?: TabInfo[]
  handleTabSelection?: (event: React.ChangeEvent<{}>, value: any) => void
  activeTabId?: string
};

export interface FBEditorHelperProps {
  openEditor?: (props?: Partial<FBInputProps>) => any
}
