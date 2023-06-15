import { FieldValidator } from 'formik';
import { FormFieldProps } from '../FormField/FormField.types';

export type FormikFieldProps = FormFieldProps & {
  name: string
  validate?: FieldValidator
};
