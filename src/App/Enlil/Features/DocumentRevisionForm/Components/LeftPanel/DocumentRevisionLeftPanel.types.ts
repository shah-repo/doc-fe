import { IntlShape } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import { DocumentRevisionFormProps, DocumentRevisionFormStateProps, SMProviderProps } from "../../../../..";
import { DocumentRevision, FBDocumentRevisionProps } from "../../../../../../state/ducks/documentRevisions/types";

export type DocumentRevisionLeftPanelProps =
& RouteComponentProps
& Pick<SMProviderProps, "_documentRevisionFormState" | "_documentRevisionLeftPanelState">
& Pick<DocumentRevisionFormProps, "documentRevisions">
& Pick<Partial<DocumentRevisionFormStateProps>,
  "documentTypeId" |
  "documentId" |
  "docId"
>
& {
  intl?: IntlShape;
  docRevsWithoutCanceled?: DocumentRevision[];
  documentRevisionId?: string;
  isInlineApproval?: boolean;
  isRecord?: boolean;
  selectedDocument?: DocumentRevision;
  canAccess?: boolean;
  showFormMigration?: boolean;
  formDocument?: FBDocumentRevisionProps;
  isNewOutput?: boolean;
  title?: string;
};

export interface DocumentRevisionLeftPanelStateProps {
  setOpen: () => void;
  setTitle: (title: string) => void;
  open: boolean;
  title: string;
}
