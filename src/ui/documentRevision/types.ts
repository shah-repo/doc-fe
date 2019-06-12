import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions";

export interface DocumentRevisionRouteParams {
  documentRevisionId: string;
}

export interface DocumentRevisionActionProps {
  editDocumentRevision: (documentRevisionId: string) => () => void;
  previewDocumentRevision: (documentRevisionId: string) => () => void;
}

export interface DocumentRevisionListItem {
  id: string;
  revision: string;
  description: string;
  name: string;
  owner: string;
  status: DocumentRevisionStatus;
  type: string;
}
