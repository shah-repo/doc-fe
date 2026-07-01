import { translate } from '../../../common/intl';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { DisplayFieldType, DOC_TYPE_GROUP_OPTION, DocumentType } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { checkIfDocumentHasOptions } from '../../documentRevision/helpers/checkDocumentGroup';
import { EXCLUDED_DOCUMENT_OPTIONS, EXCLUDED_DOCUMENT_REVISION_STATUS, SPECIAL_DOCUMENT_STATUS_CASES } from './FBEditorAutocomplete.consts';

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

  const viableStatuses = Object.values(DocumentRevisionStatus)
    .filter((status) => !EXCLUDED_DOCUMENT_REVISION_STATUS.includes(status));

  const statusDisplayOptions = viableStatuses.reduce<Map<DocumentRevisionStatus, string[]>>((acc, status) => {
    const statusLabels = documentTypesToConsider.reduce((labels, documentType) => {
      const isStatusExcluded = SPECIAL_DOCUMENT_STATUS_CASES
        .some((specialCase) => specialCase.condition(documentType) && specialCase.excludedStatuses.includes(status));
      if (isStatusExcluded) return labels;

      const statusOverride = documentType.fieldsConfig?.[DisplayFieldType[`STATUS_${status}`]];
      const statusLabel = statusOverride?.visible && statusOverride.label ? statusOverride.label : translate(status);

      if (!labels.has(statusLabel)) {
        labels.add(statusLabel);
      }
      return labels;
    }, new Set<string>());

    if (statusLabels.size > 0) {
      acc.set(status, Array.from(statusLabels));
    }
    return acc;
  }, new Map<DocumentRevisionStatus, string[]>());

  // Need this kludge as the PO status is overriden skipping fieldsConfig and overlapping with default Approved status
  if (shouldAddPoReleased) {
    const existingReleasedOptions = statusDisplayOptions.get(DocumentRevisionStatus.Released) ?? [];
    hasMultipleDocumentTypes
      ? statusDisplayOptions.set(DocumentRevisionStatus.Released, [...existingReleasedOptions, translate('RELEASED.PO')])
      : statusDisplayOptions.set(DocumentRevisionStatus.Released, [translate('APPROVED')]);
  }

  return Array.from(statusDisplayOptions.entries()).map(([status, overrides]) => ({
    id: status,
    label: overrides.join('/'),
  }));
};

export const getChangeRequestStatusOptions = (): Array<{ id: ChangeRequestStatus, label: string }> =>
  Object.values(ChangeRequestStatus).map((status) => ({
    id: status,
    label: translate(status),
  }));

export const getDocumentTypeOptions = <T extends DocumentType>(documentTypes: T[]): T[] =>
  documentTypes.filter((documentType) => {
    return documentType.active && !checkIfDocumentHasOptions(
      [
        ...EXCLUDED_DOCUMENT_OPTIONS,
      ],
      documentType.groupOptions,
    );
  });

export const getDocumentStatusOptionLabel = (
  option: ReturnType<typeof getDocumentStatusOptions>[number],
  documentStatuses: ReturnType<typeof getDocumentStatusOptions>,
): string => documentStatuses.find((o) => o.id === option.id)?.label ?? '';
