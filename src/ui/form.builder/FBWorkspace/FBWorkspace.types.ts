import { FBDialogState, FBFormProps, FBSchemaProps, FBWorkspaceState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";


export type FBWorkspaceMode = "none" | "design" | "form" | "preview";

export type FBWorkspaceProps =
& Pick<FBFormProps, "initialValues" | "children">
& {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  portalContainer?: Element;
  schema?: FBSchemaProps[];
  mode?: FBWorkspaceMode;
  isStarter?: boolean;
  active?: boolean;
  includeTransport?: boolean;
  document?: DocumentRevision;
};

export type FBWorkspaceConstructor = Pick<FBWorkspaceProps, "schema" | "mode" | "document">;
