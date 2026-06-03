import { translate } from '../../../common/intl';
import { DisplayFieldType, DOC_TYPE_GROUP_OPTION, DocumentType } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { checkIfDocumentHasOptions } from '../../documentRevision/helpers/checkDocumentGroup';
import { DIRECT_APPROVAL_DOCUMENT_REVISION_EXCLUDED_STATUSES, EXCLUDED_DOCUMENT_OPTIONS, EXCLUDED_DOCUMENT_REVISION_STATUS } from './FBEditorAutocomplete.consts';

export const getDocumentStatusOptions = (
  documentTypes: DocumentType[],
  selectedDocumentTypes: string[] = [],
): Array<{ id: DocumentRevisionStatus, label: string }> => {
  const documentTypesToConsider = selectedDocumentTypes.length
    ? documentTypes.filter((documentType) => selectedDocumentTypes.includes(documentType.id))
    : documentTypes;

  const isEmptyDocumentTypes = documentTypesToConsider.length === 0;
  const shouldAddPoReleased = isEmptyDocumentTypes || documentTypesToConsider.some((documentType) => documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.PO));
  const hasMultipleDocumentTypes = documentTypesToConsider.length > 1;

  const isOnlyDirectApprovalTypes = documentTypesToConsider.every((documentType) => documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.DIRECT_APPROVAL));

  const viableStatuses = Object.values(DocumentRevisionStatus)
    .filter((status) => {
      const isStatusExcluded = EXCLUDED_DOCUMENT_REVISION_STATUS.includes(status);
      const isStatusAllowed = isOnlyDirectApprovalTypes ? !DIRECT_APPROVAL_DOCUMENT_REVISION_EXCLUDED_STATUSES.includes(status) : true;
      return !isStatusExcluded && isStatusAllowed;
    });

  const statusDisplayOptions = viableStatuses.reduce<Map<DocumentRevisionStatus, string[]>>((acc, status) => {
    const existingStatusOptions = acc.get(status) ?? [];
    documentTypesToConsider.forEach((documentType) => {
      const isDirectApprovalType = documentType.groupOptions?.includes(DOC_TYPE_GROUP_OPTION.DIRECT_APPROVAL);
      if (isDirectApprovalType && DIRECT_APPROVAL_DOCUMENT_REVISION_EXCLUDED_STATUSES.includes(status)) {
        return;
      }

      const statusConfigKey = DisplayFieldType[`STATUS_${status}`];
      if (!statusConfigKey) return;

      const statusOverride = documentType.fieldsConfig?.[statusConfigKey];
      if (statusOverride?.visible && statusOverride.label && !existingStatusOptions.some((option) => option === statusOverride.label)) {
        existingStatusOptions.push(statusOverride.label);
      }
    });
    acc.set(status, existingStatusOptions);
    return acc;
  }, new Map<DocumentRevisionStatus, string[]>());

  // Need this kludge as the PO status is overriden skipping fieldsConfig and overlapping with default Approved status
  if (shouldAddPoReleased) {
    const existingReleasedOptions = statusDisplayOptions.get(DocumentRevisionStatus.Released) ?? [];
    hasMultipleDocumentTypes
      ? statusDisplayOptions.set(DocumentRevisionStatus.Released, [...existingReleasedOptions, translate('RELEASED.PO')])
      : statusDisplayOptions.set(DocumentRevisionStatus.Released, [translate('APPROVED')]);
  }

  return viableStatuses.map((status) => {
    const overrides = statusDisplayOptions.get(status);
    return {
      id: status,
      label: overrides?.length ? overrides.join('/') : translate(status),
    };
  });
};

export const getDocumentTypeOptions = <T extends DocumentType>(documentTypes: T[]): T[] =>
  documentTypes.filter((documentType) => {
    return documentType.active && !checkIfDocumentHasOptions(
      [
        ...EXCLUDED_DOCUMENT_OPTIONS,
      ],
      documentType.groupOptions,
    );
  });
