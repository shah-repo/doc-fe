import { get } from 'lodash';
import 'moment-timezone';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from '../../documentRevision/helpers/documentRevisionStatus';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../state/ducks/auth';

export const canEditDocumentRevision = (documentRevision: DocumentRevision) => {
  const ownerId = get(documentRevision, 'owner.id');
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  return (
    currentEmployeeId === ownerId
    && (isDocumentRevisionInDraft(documentRevision) || isDocumentRevisionPendingChange(documentRevision))
  );
};

export const documentRevisionQueryStatus = (): DocumentRevisionStatus[] =>
  Object
    .values(DocumentRevisionStatus)
    .filter((value) => value !== DocumentRevisionStatus.Deprecated && value !== DocumentRevisionStatus.Canceled);
