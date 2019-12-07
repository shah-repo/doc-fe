import { FieldProps, FormikConfig, FormikProps } from "formik";
import { Dictionary } from "lodash";
import { Id } from "../../../state/ducks/common";
import { DocumentRevisionDocument } from "../../../state/ducks/documentRevisions";
import { FBEditorElementType } from "./editor";
import { FBTemplateSchema } from "./store";

export interface FBFormikInjectedProps  {
  render?: ((props: FormikProps<any>) => React.ReactNode);
}

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
  setContext?: React.Dispatch<React.SetStateAction<boolean>>;
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
