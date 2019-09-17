import { FormikConfig, FormikProps } from "formik";

export interface FBFormInjectedProps  {
  render?: ((props: FormikProps<any>) => React.ReactNode);
}

export interface FBFormProps extends Omit<FormikConfig<any>, "onSubmit"|"initialValues"> {
  onSubmit?: (values: any) => void;
  initialValues?: any;
}
