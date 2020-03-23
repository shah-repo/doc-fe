import { DocumentRevision, DocumentRevisionStatus, Reference } from "../../../state/ducks/documentRevisions";
import { documentDetailsPathWithDeprecatedDate, documentVersionPath } from "./paths";
import { ReferenceSummary } from "./types";

const getCorrectDocRev = (documentRevisions?: DocumentRevision[]) => {
  if (!documentRevisions || documentRevisions.length === 0) {
    return null;
  }

  if (documentRevisions.length === 1) {
    return documentRevisions[0];
  }

  const released = documentRevisions.find((docRev) => docRev.status === DocumentRevisionStatus.Released);
  return released;
};

const getReferenceToUrl = (
  documentStatus: DocumentRevisionStatus,
  documentId: string,
  documentRevisionId: string,
  deprecatedAt: string,
): string => {
  if (documentStatus === DocumentRevisionStatus.Deprecated) {
    return documentDetailsPathWithDeprecatedDate(documentId, deprecatedAt);
  }

  return documentVersionPath(documentRevisionId, documentId);
};

export const getReferenceToSummary = (dataProp: Reference[], status: DocumentRevisionStatus, deprecatedAt: string) => {
  const summaries: ReferenceSummary[] = [];

  dataProp.forEach((ref) => {
    const docRev = getCorrectDocRev(ref.documentRevisions);

    if (!docRev) {
      return;
    }

    summaries.push(
      {
        id: ref.id,
        url: getReferenceToUrl(status, ref.id, docRev.id, deprecatedAt),
        title: `${ref.docId} - ${docRev.name}`,
      },
    );
  });

  return summaries;
};

const getReferencedByUrl = (reference: Reference) => documentVersionPath(reference.id, reference.document.id);

export const getReferencedBySummary = (dataProp: DocumentRevision[]): ReferenceSummary[] => {
  const summaries: ReferenceSummary[] = [];

  const byDocument: { [key: string]: DocumentRevision } = dataProp.reduce((acc, docRev) =>
  {
    const { status } = docRev;
    const { id } = docRev.document;

    if (!acc[id] || status === DocumentRevisionStatus.Released) {
      acc[id] = docRev;
    }

    return acc;
  }, {});

  Object.values<DocumentRevision>(byDocument).forEach((docRev: DocumentRevision) => {
    summaries.push(
      {
        id: docRev.id,
        url: getReferencedByUrl(docRev),
        title: `${docRev.document.docId} - ${docRev.name}`,
      },
    );
  });

  return summaries;
};
