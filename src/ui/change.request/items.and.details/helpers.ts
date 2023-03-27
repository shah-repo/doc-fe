import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
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


export const formDataToStoreData = (
  documentRevisionsAssigned: FBDocumentRevisionsValue[], documentRevisionsData?: any[]) =>

  documentRevisionsAssigned.map((item: FBDocumentRevisionsValue) => {
    const entryInfo = {
      justificationOfChange: item.justificationOfChange,
      descriptionOfChange: item.descriptionOfChange,
      docRevId: item.proposedDocumentRevision.id,
      documentId: "",
      id: item.id,
      titleText: "",
      displayRevision: "",
      isPart: false,
    };

    const docRevId = item.proposedDocumentRevision.id;

    const { displayRevision, name, document } =
        documentRevisionsData?.find((docRev: DocumentRevision) => docRev.id === docRevId) ?? {};
    if (document) {
      entryInfo.titleText = generateDocTitleText(document.docId, displayRevision, name);
      entryInfo.isPart = document.documentType.group === DOC_TYPE_GROUP.PART;
      entryInfo.documentId = document.id;
      entryInfo.displayRevision = displayRevision;
    }

    return entryInfo;
  });

