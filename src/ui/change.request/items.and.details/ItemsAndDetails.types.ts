export interface FBDocumentRevisionResponse {
  companyId: string;
  createdAt: string;
  displayRevision: string;
  document: {
    docId:  string;
    id: string;
    documentType: {
      group: string;
    };
  };
  id: string;
  name: string;
  updatedAt: string;
}

export interface FBDocumentRevisionsValue {
  id: string;
  proposedDocumentRevision: {
    id: string;
  };
  justificationOfChange: string;
  descriptionOfChange: string;
}

export interface ChangeOrderGridItem {
  id: string;
  docRevId: string;
  documentId: string;
  justificationOfChange: string;
  descriptionOfChange: string;
  titleText: string;
  displayRevision: string;
  isPart: boolean;
}

export type FBDocumentRevisionsItemProps =
& ChangeOrderGridItem
& {
  generateDocTitleText: (docId: string, displayRevision: string, name: string) => string;
};
