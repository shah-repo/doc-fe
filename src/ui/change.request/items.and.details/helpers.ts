import { Attachment } from '../../../state/ducks/attachments/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { checkIsDocumentOTHER, checkIsDocumentPart } from '../../documentRevision/helpers/checkDocumentGroup';
import { ApprovalRequestGridItem, FBDocumentRevisionsValue } from './ItemsAndDetails.types';

export const generateDocTitleText = (docId: string, displayRevision: string, name?: string): string => (
  `${docId} • Rev ${displayRevision}${name ? ` - ${name}` : ''}`
);

export const storeDataToFormData = (approvalRequestItemsList: ApprovalRequestGridItem[]): FBDocumentRevisionsValue[] => (
  approvalRequestItemsList.map((item: ApprovalRequestGridItem) => (
    {
      justificationOfChange: item.justificationOfChange,
      descriptionOfChange: item.descriptionOfChange,
      id: item.id,
      proposedDocumentRevision: {
        id: item.docRevId,
      },
      revisionFormTo: item.revisionFormTo,
      attachments: item.attachments,
      autoUpdate: item.autoUpdate,
    }
  ))
);

export const formDataToStoreData = (
  documentRevisionsAssigned: FBDocumentRevisionsValue[],
  documentRevisionsData?: any[],
) => documentRevisionsAssigned.map((item: FBDocumentRevisionsValue) => {
  const entryInfo = {
    justificationOfChange: item.justificationOfChange,
    descriptionOfChange: item.descriptionOfChange,
    docRevId: item.proposedDocumentRevision.id,
    autoUpdate: item.autoUpdate,
    documentId: '',
    id: item.id,
    titleText: '',
    displayRevision: '',
    isPart: false,
    revisionFormTo: item.revisionFormTo,
    whereUsedView: item.whereUsedView,
    attachments: [] as Attachment[],
  };

  const docRevId = item.proposedDocumentRevision.id;
  const { displayRevision, document, attachments }
          = documentRevisionsData?.find((docRev: DocumentRevision) => docRev.id === docRevId) ?? {};

  if (document) {
    entryInfo.titleText = generateDocTitleText(document.docId, displayRevision);
    entryInfo.isPart
          = checkIsDocumentPart(document.documentType.group) || checkIsDocumentOTHER(document.documentType.group);
    entryInfo.documentId = document.id;
    entryInfo.displayRevision = displayRevision;
    entryInfo.attachments = (attachments || []);
  }

  return entryInfo;
});
