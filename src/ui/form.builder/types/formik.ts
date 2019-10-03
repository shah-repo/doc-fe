import { FormikConfig, FormikProps } from "formik";

export interface FBFormikInjectedProps  {
  render?: ((props: FormikProps<any>) => React.ReactNode);
}

export interface FBFormikProps extends Omit<FormikConfig<any>, "onSubmit"|"initialValues"> {
  onSubmit?: (values: any) => void;
  initialValues?: any;
  formComponent?: Element;
}
