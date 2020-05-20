import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { generateVersionNumber } from "../../documentRevision/helpers";

export const generateDocIdLabel = (docRev?: DocumentRevision) => {
  if (!docRev) {
    return "N/A";
  }
  const { document: { docId } } = docRev;
  return `${docId} - ${docIdVersion(docRev)}`;
};

export const docIdVersion = (docRev: DocumentRevision) => {
  const { revision, revisionStage, revisionChangeType } = docRev;
  return generateVersionNumber(revision, revisionStage, revisionChangeType);
};
