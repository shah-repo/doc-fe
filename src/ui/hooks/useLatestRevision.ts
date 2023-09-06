import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../state/reducers';
import { AsyncStatus } from '../../state/types';

export const useLatestRevisionId = (revision?: DocumentRevision, status?: DocumentRevisionStatus): string | undefined => {
  const document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, revision?.document.id ?? ''),
  );
  const allRevisions = document?.documentRevisions.reverse() ?? [];
  const latestRevision = status ? allRevisions.find(rev => rev.status === status) : allRevisions.at(0);
  return latestRevision?.id;
};

export const useLatestRevision = (revision: DocumentRevision, status?: DocumentRevisionStatus): DocumentRevision | undefined => {
  const latestReleasedRevId = useLatestRevisionId(revision, status);
  const docRevById = useSelector(documentRevisionsSelectors.byId);
  const asyncState = useSelector(documentRevisionsSelectors.getLoadAsyncState);
  const dispatch = useDispatch();

  useEffect(() => {
    const shouldSkip
      = asyncState.status === AsyncStatus.Active
        || !latestReleasedRevId
        || docRevById[latestReleasedRevId];

    if (shouldSkip) {
      return;
    }
    dispatch(documentRevisionsActions.load(latestReleasedRevId));
  }, [asyncState.status, dispatch, docRevById, latestReleasedRevId]);

  return latestReleasedRevId ? docRevById[latestReleasedRevId] : undefined;
};
