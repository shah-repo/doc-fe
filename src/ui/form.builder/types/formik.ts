import { FieldConfig, FieldProps, FormikConfig } from "formik";
import { Dictionary } from "lodash";
import { Id } from "../../../state/ducks/common";
import { DocumentRevisionDocument } from "../../../state/ducks/documentRevisions";
import { FBTemplateSchema } from "./store";

export interface FBFormikProps extends Omit<FormikConfig<any>, "onSubmit" | "initialValues"> {
  onSubmit?: (values: any) => void;
  initialValues?: any;
  formComponent?: Element;
}

export type FBFormikFieldProps =
  & Partial<FieldProps>
  & Pick<Partial<FieldConfig>, "validate">;

export interface FBDocumentFlowProps {
  id?: string;
  formTemplate?: FBFormTemplateProps;
  formDocument?: FBDocumentFlowProps;
  formInput?: Dictionary<any>;
  document?: Partial<DocumentRevisionDocument>;
  revision?: number;
  revisionStage?: number;
  releasedAt?: string;
}

export interface FBFormTemplateProps {
  outputDocumentType: Id;
  schema: FBTemplateSchema[] | string;
}
