import { FieldConfig, FieldProps, FormikConfig } from "formik";
import { Dictionary } from "lodash";
import { DocumentRevisionDocumentRequest, DocumentRevisionStatus, FBFormTemplateProps, RevisionChangeType } from "../../../state/ducks/documentRevisions";

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
  document?: Partial<DocumentRevisionDocumentRequest>;
  revision?: number;
  revisionStage?: number;
  revisionChangeType?: RevisionChangeType;
  releasedAt?: string;
  renderHTML?: string;
  status?: DocumentRevisionStatus;
}
