import { last } from 'lodash';
import { checkIsDocumentES, checkIsDocumentForm } from '../../../helpers/checkDocumentGroup';
import { DocumentRevision, DocumentRevisionStatus, FBOutputDocumentType } from '../../../../../state/ducks/documentRevisions/types';
import { RelatedEquipment } from './types';
import { isDocumentRevisionInDraft, isDocumentRevisionReleased, isDocumentRevisionInStatus } from '../../../helpers/documentRevisionStatus';

interface GenerateRelatedEquipmentDocIdParameters {
  parentDocumentRevision: DocumentRevision
  relatedEquipments: RelatedEquipment[]
  relatedAcronym: string
}

function twoDigits (value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function generateRelatedEquipmentDocId ({ parentDocumentRevision, relatedEquipments, relatedAcronym }: GenerateRelatedEquipmentDocIdParameters): string {
  const parentAcronym = parentDocumentRevision.document?.documentType?.documentTypeAcronym ?? '';

  const lastDocId = last(relatedEquipments)?.docId ?? '';
  const lastRelatedNumber = parseInt(last(lastDocId.split('-')) ?? '', 10) || 0;
  const newRelatedNumber = lastRelatedNumber + 1;

  return `${parentDocumentRevision.document.docId}-${twoDigits(newRelatedNumber)}`
    .replace(parentAcronym, relatedAcronym);
}

// Show empty table.
export function shouldShowRelatedEquipmentsTable (documentRevision: DocumentRevision): boolean {
  const groupOptions = documentRevision?.document?.documentType?.groupOptions;
  const outputDocumentType = documentRevision?.formTemplate?.outputDocumentTypes?.[0] as FBOutputDocumentType;

  const isForm = checkIsDocumentForm(groupOptions);
  const isESForm = isForm && checkIsDocumentES(outputDocumentType?.groupOptions);
  const isES = checkIsDocumentES(groupOptions);

  return isESForm || isES;
}

// Should fetch table content.
export function shouldFetchRelatedEquipments (documentRevision: DocumentRevision): boolean {
  const isES = checkIsDocumentES(documentRevision?.document?.documentType?.groupOptions);

  return isES && (
    isDocumentRevisionInStatus(
      [DocumentRevisionStatus.Released, DocumentRevisionStatus.Deprecated],
      documentRevision?.status,
    )
    || documentRevision?.version > 1
  );
}

// Allow edit table content.
export function shouldHaveEditableRelatedEquipments (documentRevision: DocumentRevision): boolean {
  const isReleased = isDocumentRevisionReleased(documentRevision?.status);
  return shouldFetchRelatedEquipments(documentRevision) && isReleased;
}

export function shouldShowSyncForRelatedEquipment (documentRevision: DocumentRevision): boolean {
  return Boolean(documentRevision?.needSync && documentRevision?.formInput?.equipmentSpecification && isDocumentRevisionInDraft(documentRevision?.status));
}
