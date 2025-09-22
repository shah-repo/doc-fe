import { FBEditorProps, FBRangeValue } from '..';
export interface FBEditorTextFieldWithRangeConfig {
  isCriticalToQuality?: boolean
  isInspected?: boolean
  hasRange?: boolean
  range?: FBRangeValue
  hasTolerance?: boolean
  tolerance?: number
  hasUnits?: boolean
}

export type FBEditorTextFieldWithRangeProps = FBEditorProps & {
  editorConfig?: FBEditorTextFieldWithRangeConfig
};
