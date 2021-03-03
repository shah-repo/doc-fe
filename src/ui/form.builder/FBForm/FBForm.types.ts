import { Dictionary } from "lodash";
import { FBFormState } from ".";
import { FBSchemaProps, FBWorkspaceMode, FBWorkspaceState } from "..";

export interface FBValidationRelatedRules {
  name: string;
  value: any;
}

export enum FBFormMode {
  add = "form.builder.add",
  edit = "form.builder.edit",
}

export interface FBFormProps {
  initialValues?: Dictionary<any>;
  children?: React.ReactNode | React.ReactNode[];
  formState?: FBFormState;
  schema?: FBSchemaProps[];
  workspaceMode?: FBWorkspaceMode;
  errorValidation?: boolean;
  initialValidation?: boolean;
}

export type FBFormConstructor = Pick<FBFormProps, "schema" | "initialValues" | "workspaceMode">
& {
  workspaceState?: FBWorkspaceState;
};
