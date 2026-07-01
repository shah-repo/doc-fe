import { DOC_TYPE_GROUP_OPTION, DocumentType } from '../../../state/ducks/documentRevisions/documentType/types';
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

export const SPECIAL_DOCUMENT_STATUS_CASES = [
  {
    condition: (documentType: DocumentType): boolean => documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.DIRECT_APPROVAL) ?? false,
    excludedStatuses: [
      DocumentRevisionStatus.Approved,
      DocumentRevisionStatus.PendingChange,
    ],
  },
  {
    condition: (documentType: DocumentType): boolean => documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.GROUP_TRAINING) ?? false,
    excludedStatuses: [
      DocumentRevisionStatus.InReview,
      DocumentRevisionStatus.PendingChange,
      DocumentRevisionStatus.Approved,
    ],
  },
];
