import { FormikConfig, FormikProps } from "formik";
import { Id } from "../../../state/ducks/common";
import { FBTemplateSchema } from "./store";

export interface FBFormikInjectedProps  {
  render?: ((props: FormikProps<any>) => React.ReactNode);
}

export interface FBFormikProps extends Omit<FormikConfig<any>, "onSubmit"|"initialValues"> {
  onSubmit?: (values: any) => void;
  initialValues?: any;
  formComponent?: Element;
}

export interface FBFormInputProps {
  formInput?: string;
}

export interface FBFormTemplateProps {
  outputDocumentType: Id;
  schema: FBTemplateSchema[] | string;
}
