import { FieldProps } from "formik";

export interface FormikHybridFieldProps extends Partial<FieldProps> {
  name: string;
}
