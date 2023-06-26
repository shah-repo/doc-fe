import { Form } from 'formik';
import React, { useEffect } from 'react';

interface Props {
  dirty: boolean
  resetForm: () => void
  initialValues: any
}

const FormWrapper: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  children,
}) => {
  useEffect(() => {
    if (dirty) {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <Form>
      {children}
    </Form>
  );
};

export default FormWrapper;
