import { translate } from '../../../common/intl';
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

export const DOCUMENT_REVISION_STATUS_LABELS: Partial<Record<DocumentRevisionStatus, string[]>> = {
  [DocumentRevisionStatus.Draft]: [
    translate('DRAFT'),
    translate('DRAFT.LOT'),
    translate('DRAFT.GRPT'),
  ],
  [DocumentRevisionStatus.InReview]: [
    translate('IN_REVIEW'),
    translate('IN_REVIEW.PO'),
    translate('IN_REVIEW.SUP'),
    translate('IN_REVIEW.WO'),
  ],
  [DocumentRevisionStatus.PendingChange]: [
    translate('PENDING_CHANGE'),
  ],
  [DocumentRevisionStatus.Approved]: [
    translate('APPROVED'),
  ],
  [DocumentRevisionStatus.Released]: [
    translate('RELEASED'),
    translate('COMPLETED'),
  ],
};

export const documentRevisionStatusOptions = Object.values(DocumentRevisionStatus)
  .filter((status) => !EXCLUDED_DOCUMENT_REVISION_STATUS.includes(status) && DOCUMENT_REVISION_STATUS_LABELS[status])
  .map((status) => ({
    id: status,
    label: DOCUMENT_REVISION_STATUS_LABELS[status]?.join('/'),
  }));
