import { FBDialogState, FBFormProps, FBSchemaProps, FBSnackbarState, FBWorkspaceState } from "..";
import { UserGroupsState, UserState } from "../../../state/ducks/auth/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { Company } from "../../../state/ducks/company/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBWorkspaceMode =
| "none"
| "design"
| "form"
| "formPreview"
| "preview"
| "formDesign";

export type FBWorkspaceProps =
& Pick<FBFormProps, "initialValues" | "children">
& {
  workspaceState?: FBWorkspaceState;
  dialogState?: FBDialogState;
  snackbarState?: FBSnackbarState;
  portalContainer?: React.MutableRefObject<HTMLDivElement | null>;
  schema?: FBSchemaProps[];
  mode?: FBWorkspaceMode;
  isStarter?: boolean;
  active?: boolean;
  includeTransport?: boolean;
  document?: DocumentRevision;
  changeRequest?: ChangeRequest;
  autosave?: boolean;
  includeProcedureDiff?: boolean;
  // Temp portal flag. This will be removed once the RichTextEditor double mounting is fixed
  isPortal?: boolean;
};

export interface FBWorkspaceExternalState {
  company?: {
    selectedCompany: Company;
    companyMine: Company;
  };
  auth?: {
    user: UserState;
    groups: UserGroupsState;
  };
  documentType?: {
    byId: any;
  };
  documentRevisions?: {
    byId: any;
  };
}

export type FBWorkspaceConstructor = Pick<FBWorkspaceProps, "schema" | "mode" | "autosave">;
