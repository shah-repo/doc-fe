import { FormikConfig, FormikProps } from "formik";
import { Dictionary } from "lodash";
import { Id } from "../../../state/ducks/common";
import { DocumentRevisionDocument } from "../../../state/ducks/documentRevisions";
import { FBTemplateSchema } from "./store";

export interface FBFormikInjectedProps  {
  render?: ((props: FormikProps<any>) => React.ReactNode);
}

export interface FBFormikProps extends Omit<FormikConfig<any>, "onSubmit"|"initialValues"> {
  onSubmit?: (values: any) => void;
  initialValues?: any;
  formComponent?: Element;
}

export interface FBDocumentFlowProps {
  id?: string;
  formTemplate?: FBFormTemplateProps;
  formDocument?: FBDocumentFlowProps;
  formInput?: string | Dictionary<any>;
}

export interface FBDocumentProps extends FBDocumentFlowProps {
  document?: Partial<DocumentRevisionDocument>;
}

export interface FBFormTemplateProps {
  id?: string;
  outputDocumentType: Id;
  schema: FBTemplateSchema[] | string;
}
