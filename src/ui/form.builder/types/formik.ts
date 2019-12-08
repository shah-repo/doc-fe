import { FieldProps, FormikConfig } from "formik";
import { Dictionary } from "lodash";
import { Id } from "../../../state/ducks/common";
import { DocumentRevisionDocument } from "../../../state/ducks/documentRevisions";
import { FBEditorElementType } from "./editor";
import { FBTemplateSchema } from "./store";

export interface FBFormikProps extends Omit<FormikConfig<any>, "onSubmit" | "initialValues"> {
  onSubmit?: (values: any) => void;
  initialValues?: any;
  formComponent?: Element;
}

export type FBFormikFieldProps =
  & Partial<FieldProps>
  & {
  name?: string;
  type?: FBEditorElementType | string;
  includeContext?: boolean;
  contextLabel?: string;
  showContext?: boolean;
  onChange?: (e: any, value: any) => void;
};

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
