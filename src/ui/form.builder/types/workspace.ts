import { Dictionary } from "lodash";
import { FBDialogState, FBSnackbarState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBFormikFieldProps } from "./formik";
import { FBTemplateSchema } from "./store";

export type FBWorkspaceMode =
| "none"
| "design"
| "form"
| "preview";

export type FBWorkspaceProps =
  & Omit<FBFormikFieldProps, "name">
  & {
    id?: string;
    documentId?: string;
    mode?: FBWorkspaceMode;
    includeTransport?: boolean;
    isStarter?: boolean;
    schema?: FBTemplateSchema[];
    values?: Dictionary<any>;
    dialogState?: FBDialogState;
    snackbarState?: FBSnackbarState;
    document?: DocumentRevision;
  };
