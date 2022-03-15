import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export interface ReferencesProps {
  selectedDocument: DocumentRevision | undefined;
  edit: boolean;
}
