import { ChangeOrderGridItem, FBDocumentRevisionsValue } from "./ItemsAndDetails.types";

export const generateDocTitleText = (docId: string, displayRevision: string, name: string) => (
  `${docId} # rev ${displayRevision} - ${name}`
);

export const storeDataToFormData = (changeOrderItemsList: ChangeOrderGridItem[]): FBDocumentRevisionsValue[] => (
  changeOrderItemsList.map((item: ChangeOrderGridItem) => (
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

