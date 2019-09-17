import { FormikProps } from "formik";

export interface FBFormInjectedProps  {
  render?: ((props: FormikProps<any>) => React.ReactNode);
}
