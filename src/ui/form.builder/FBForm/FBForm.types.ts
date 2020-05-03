import { Dictionary } from "lodash";
import { FBFormState } from ".";
import { FBSchemaProps, FBWorkspaceMode } from "..";

export interface FBFormProps {
  initialValues?: Dictionary<any>;
  children?: React.ReactNode | React.ReactNode[];
  formState?: FBFormState;
  schema?: FBSchemaProps[];
  workspaceMode?: FBWorkspaceMode;
  errorValidation?: boolean;
  initialValidation?: boolean;
}
