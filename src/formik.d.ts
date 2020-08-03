import { FormikFormProps } from "formik";

declare module "formik" {
  export function Form(props: FormikFormProps): JSX.Element;
}
