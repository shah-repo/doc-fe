import { documentDetailsPathWithDeprecatedDate, documentPreviewPath, documentVersionPath } from "./paths";
import { DocumentRevision, DocumentRevisionStatus, Reference } from "../../../state/ducks/documentRevisions";
import { ReferenceSummary } from "./types";

const getCorrectDocRev = (documentRevisions?: DocumentRevision[]) => {
  if (!documentRevisions || documentRevisions.length === 0) {
    return null;
  }

  if (documentRevisions.length === 1) {
    return documentRevisions[0];
  }

  const released = documentRevisions.find(docRev => docRev.status === DocumentRevisionStatus.Released);
  return released;
}

const getReferenceToUrl = (
  documentStatus: DocumentRevisionStatus,
  documentId: string,
  documentRevisionId: string,
  deprecatedAt: string
): string => {
  if (documentStatus === DocumentRevisionStatus.Deprecated) {
    return documentDetailsPathWithDeprecatedDate(documentId, deprecatedAt)
  }

  return documentVersionPath(documentRevisionId, documentId);
}

export const getReferenceToSummary = (dataProp: Reference[], status: DocumentRevisionStatus, deprecatedAt: string) => {
  const summaries: ReferenceSummary[] = [];

  dataProp.forEach(ref => {
    let docRev = getCorrectDocRev(ref.documentRevisions);

    if (!docRev) {
      return;
    }

    summaries.push(
      {
        id: ref.id,
        url: getReferenceToUrl(status, ref.id, docRev.id, deprecatedAt),
        title: `${ref.docId} - ${docRev.name}`,
      }
    )
  });

  return summaries;
}

const getReferencedByUrl = (reference: Reference) => documentVersionPath(reference.id, reference.document.id);

export const getReferencedBySummary = (dataProp: Reference[]) => {
  const summaries: ReferenceSummary[] = [];

  dataProp.forEach(reference => {
    summaries.push(
      {
        id: reference.id,
        url: getReferencedByUrl(reference),
        title: `${reference.document.docId} - ${reference.name}`,
      }
    )
  });

  return summaries;
}