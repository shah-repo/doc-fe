import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { checkIsDocumentOTHER, checkIsDocumentPart } from '../../documentRevision/helpers/checkDocumentGroup';
import { ApprovalRequestGridItem, FBDocumentRevisionsValue } from './ItemsAndDetails.types';

export const generateDocTitleText = (docId: string, displayRevision: string, name: string) => (
  `${docId} • Rev ${displayRevision} - ${name}`
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
      autoUpdate: item.autoUpdate,
    }
  ))
);

export const formDataToStoreData = (
  documentRevisionsAssigned: FBDocumentRevisionsValue[], documentRevisionsData?: any[]) =>

  documentRevisionsAssigned.map((item: FBDocumentRevisionsValue) => {
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
    };

    const docRevId = item.proposedDocumentRevision.id;

    const { displayRevision, name, document }
        = documentRevisionsData?.find((docRev: DocumentRevision) => docRev.id === docRevId) ?? {};
    if (document) {
      entryInfo.titleText = generateDocTitleText(document.docId, displayRevision, name);
      entryInfo.isPart
        = checkIsDocumentPart(document.documentType.group) || checkIsDocumentOTHER(document.documentType.group);
      entryInfo.documentId = document.id;
      entryInfo.displayRevision = displayRevision;
    }

    return entryInfo;
  });
