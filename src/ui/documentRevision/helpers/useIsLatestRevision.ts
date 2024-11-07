import { useSelector } from 'react-redux';
import { documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../state/reducers';
import { getLatestRevisionId } from '../../document.revision/utils/helpers';

export const useIsLatestRevision = (documentRevision: DocumentRevision): boolean => {
  const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
  const { documentId } = documentRevision ?? {};

  const documentRevisions = useSelector((state: ApplicationState) => getDocumentRevisions(state, documentId ?? ''));
  const latestRevisionId = getLatestRevisionId(documentRevisions);

  return latestRevisionId === documentRevision?.id;
};
