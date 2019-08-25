import { DocumentRevisionStatus } from "../../state/ducks/documentRevisions";

export interface DocumentRevisionRouteParams {
  documentRevisionId: string;
  documentId: string;
}

export interface DocumentRevisionActionProps {
  editDocumentRevision: (documentRevisionId: string, documentId: string) => () => void;
  previewDocumentRevision: (documentRevisionId: string, documentId: string) => () => void;
}

export interface DocumentRevisionListItem {
  id: string;
  revision: number;
  description: string;
  name: string;
  owner: string;
  status: DocumentRevisionStatus;
  type: string;
}
