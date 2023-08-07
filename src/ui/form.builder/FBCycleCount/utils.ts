import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';

export const getLatestRevisionId = (revisions: DocumentRevision[]): string => {
  const sortedRevisions
    = revisions
      .filter(revision => revision.status !== DocumentRevisionStatus.Canceled)
      .sort((a, b) => b.version - a.version);
  return sortedRevisions[0].id;
};
