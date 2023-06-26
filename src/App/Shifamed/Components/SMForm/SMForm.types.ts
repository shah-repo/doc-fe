import { SMProviderProps, SMTemplateProps } from '../../..';
import { FBWorkspaceMode } from '../../../../ui/form.builder';

export type SMFormProps =
& SMTemplateProps
& {
  values?: Record<string, any>

  /**
   * @cfg {Boolean} If true validate form on it's initial render.
   * Default to false.
   */
  initialValidation?: boolean
};

export interface SMFormStateProps {
  setValues: (values?: SMFormProps['values']) => void
  setValue: (name?: string, value?: any) => void
  getValue: (name?: string) => any
  getValues: () => Record<string, any>
  validate: (callback?: (valid: boolean) => any) => void
  setMode: (mode: FBWorkspaceMode) => void
  setDirty: (isDirty: boolean) => void
  setAutosave: (autosave: boolean) => void
  getRules: () => Record<string, any>
  setRule: (name: string, rules: string) => void
  setLoading: (loading?: boolean) => void
  isLHRProductionBuild: boolean
  Validator: any
  values: Map<string, any>
  oldValues: SMFormProps['values']
  validationValues: SMFormProps['values']
  validationAttributeNames: Record<string, string>
  rules: Record<string, any>
  errors: Map<string, string>
  hidden: Map<string, boolean>
  mode: FBWorkspaceMode
  isDirty: boolean
  active: boolean
  autosave: boolean
  render: boolean
  loading: boolean
}

export type SMFormHOCProps = Pick<SMProviderProps, '_formState'>;
