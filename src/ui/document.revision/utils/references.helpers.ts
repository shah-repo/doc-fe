import { DocumentRevision, DocumentRevisionStatus, Reference } from "../../../state/ducks/documentRevisions";
import { documentVersionPath } from "./paths";
import { ReferenceSummary } from "./types";

const handleReferenceForDeprecated = (documentRevisions: DocumentRevision[], deprecatedAt: string) => {
  const docRevDeprecatedAfterThisDocument = documentRevisions.find((docRev) => {
    if (!docRev.deprecatedAt) {
      return false;
    }
    return new Date(docRev.deprecatedAt).valueOf() - new Date(deprecatedAt).valueOf() >= 0;
  });

  if (docRevDeprecatedAfterThisDocument) {
    return docRevDeprecatedAfterThisDocument;
  }

  return documentRevisions.find((docRev) => docRev.status === DocumentRevisionStatus.Released);
};

const getCorrectDocRev = (
  status: DocumentRevisionStatus,
  deprecatedAt: string,
  documentRevisions?: DocumentRevision[],
) => {
  if (!documentRevisions || documentRevisions.length === 0) {
    return null;
  }

  if (documentRevisions.length === 1) {
    return documentRevisions[0];
  }

  if (status === DocumentRevisionStatus.Deprecated || status === DocumentRevisionStatus.Obsolete) {
    return handleReferenceForDeprecated(documentRevisions, deprecatedAt);
  }

  const released = documentRevisions.find((docRev) => docRev.status === DocumentRevisionStatus.Released ||
    docRev.status === DocumentRevisionStatus.Obsolete);
  return released;
};

export const getReferenceToSummary = (dataProp: Reference[], status: DocumentRevisionStatus, deprecatedAt: string) => {
  const summaries: ReferenceSummary[] = [];

  dataProp.forEach((ref) => {
    const docRev = getCorrectDocRev(status, deprecatedAt, ref.documentRevisions);

    if (!docRev) {
      return;
    }
    summaries.push(
      {
        id: ref.id,
        url: documentVersionPath(docRev.id, ref.id),
        docId: ref.docId,
        title: docRev.name,
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
        docId: docRev.document.docId,
        title: docRev.name,
      },
    );
  });

  return summaries;
};
