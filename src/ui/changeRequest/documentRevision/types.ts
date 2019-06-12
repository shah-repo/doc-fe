import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions';

export interface DocumentRevisionListItem {
  id: string;
  name: string;
  owner: string;
  state: DocumentRevisionStatus;
  version: string;
}