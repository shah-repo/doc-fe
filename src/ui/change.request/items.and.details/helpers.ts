import { ApprovalRequestGridItem, FBDocumentRevisionsValue } from "./ItemsAndDetails.types";

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
    }
  ))
);
