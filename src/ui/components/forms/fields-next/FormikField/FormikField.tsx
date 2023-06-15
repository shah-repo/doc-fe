import { useField, useFormikContext } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { FormField } from '..';
import { withThemeNext } from '../../../../layout/theme-next';
import { required as requiredValidator, validator } from '../../fields/validators';
import { FormikFieldProps } from './FormikField.types';

const FormikField: React.FC<FormikFieldProps> = React.forwardRef(({
  name,
  error,
  helperText,
  children,
  validate,
  required,
  ...props
}, ref) => {
  const [, meta] = useField(name);
  // TODO needed to avoid https://github.com/jaredpalmer/formik/issues/2589
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { registerField, unregisterField, setFieldValue } = useFormikContext();

  const getFieldValidator = useCallback(
    () => {
      if (validate) {
        return validate;
      }
      if (required) {
        return validator(requiredValidator);
      }
    },
    [required, validate],
  );

  useEffect(() => {
    registerField(name, { validate: getFieldValidator() });
    return () => unregisterField(name);
  }, [name, getFieldValidator, registerField, unregisterField]);

  // TODO needed to avoid https://github.com/jaredpalmer/formik/issues/2385
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setFieldValue(name, meta.initialValue), []);

  const finalError = error ?? (meta.touched && Boolean(meta.error));
  const finalHelperText = finalError ? meta.error : helperText;

  return (
    <FormField
      {...props}
      required={required}
      error={finalError}
      helperText={finalHelperText}
      data-cy={`field-${name}`}
      ref={ref}
    >
      {children}
    </FormField>
  );
});

export default withThemeNext(FormikField);
