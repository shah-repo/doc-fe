import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { generateRevisionNumber } from "../../documentRevision/helpers/generateRevisionNumber";

export const generateDocIdLabel = (docRev?: DocumentRevision) => {
  if (!docRev) {
    return "N/A";
  }
  const { document: { docId } } = docRev;
  return `${docId} - ${docIdVersion(docRev)}`;
};

export const docIdVersion = (docRev: DocumentRevision) => {
  const { revision, subRevision, revisionStage, revisionChangeType } = docRev;
  return generateRevisionNumber(revision, revisionStage, subRevision, revisionChangeType);
};
