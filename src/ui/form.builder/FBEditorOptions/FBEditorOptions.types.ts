import { FBEditorPropertiesType, FBOption } from '..';

export interface FBEditorOptionsProps {
  stringToOptions?: (options?: string, editorProperties?: FBEditorPropertiesType[]) => any
  optionsToString?: (options?: FBOption[]) => any
}
