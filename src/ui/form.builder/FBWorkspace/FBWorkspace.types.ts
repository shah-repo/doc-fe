import { FBWorkspaceState } from ".";
import { FBSchemaProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBDialogState } from "../FBDialog";
import { FBFormProps } from "../FBForm";


export type FBWorkspaceMode = "none" | "design" | "form" | "preview";

export type FBWorkspaceProps =
& Pick<FBFormProps, "initialValues" | "children">
& {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  portalContainer?: React.MutableRefObject<null>;
  schema?: FBSchemaProps[];
  mode?: FBWorkspaceMode;
  isStarter?: boolean;
  active?: boolean;
  includeTransport?: boolean;
  // OLD: to be removed
  id?: string;
  documentId?: string;
  document?: Partial<DocumentRevision>;
};

export interface FBWorkspaceConstructor {
  schema?: FBSchemaProps[];
  mode?: FBWorkspaceMode;
}
