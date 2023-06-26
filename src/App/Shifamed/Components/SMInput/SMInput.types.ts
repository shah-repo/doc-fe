import { BaseTextFieldProps, BoxProps } from '@material-ui/core';
import { SMTextProps } from '../../..';

interface SMInputValidationProps {
  /**
   * @cfg {Boolean} If true allow form state to record the value
   * but don't include it in validation rules.
   */
  omit?: boolean
}

export type SMInputProps =
& Pick<BaseTextFieldProps,
  | 'children'
  | 'error'
  | 'value'
  | 'disabled'
  | 'name'
  | 'helperText'
  | 'rows'
  | 'placeholder'
  | 'defaultChecked'
  | 'fullWidth'
  | 'hidden'
>
& {
  label?: SMTextProps['label']
  boxProps?: BoxProps
  /**
   * @cfg {String} Validation rules.
   */
  rules?: string
  /**
   * @cfg {Boolean} Flag to record the input value
   * with state change and force it's rerendering.
   */
  withState?: boolean
  /**
   * @cfg {Object} Set of validation props.
   */
  validationConfig?: SMInputValidationProps
};
