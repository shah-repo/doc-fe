import { FormikHelpers as FormikActions } from "formik";

const getFormikActions = <T = any>(): FormikActions<T> => ({
  resetForm: jest.fn(),
  setErrors: jest.fn(),
  setFieldError: jest.fn(),
  setFieldTouched: jest.fn(),
  setFieldValue: jest.fn(),
  setFormikState: jest.fn(),
  setStatus: jest.fn(),
  setSubmitting: jest.fn(),
  setTouched: jest.fn(),
  setValues: jest.fn(),
  validateField: jest.fn(),
  validateForm: jest.fn(),
});

export default getFormikActions;
