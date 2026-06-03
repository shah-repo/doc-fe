import { DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';

export const EXCLUDED_DOCUMENT_OPTIONS = [
  DOC_TYPE_GROUP_OPTION.CHANGE_REQUEST,
];

export const EXCLUDED_DOCUMENT_REVISION_STATUS = [
  DocumentRevisionStatus.Canceled,
  DocumentRevisionStatus.Deprecated,
  DocumentRevisionStatus.Obsolete,
  DocumentRevisionStatus.Voided,
];

export const DIRECT_APPROVAL_DOCUMENT_REVISION_EXCLUDED_STATUSES = [
  DocumentRevisionStatus.Approved,
  DocumentRevisionStatus.PendingChange,
];
