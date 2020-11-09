import { isEmpty } from "lodash";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { checkIsDocumentRecord } from "./checkDocumentGroup";

export const getIsAdministrativeDefault = (documentRevision: DocumentRevision) => {
  const docId = documentRevision.formDocument?.document?.docId;
  const isAlphaReleased = isDocumentAlphaReleased(documentRevision.revisionStage);
  const isRecord = checkIsDocumentRecord(documentRevision.document?.documentType?.groupOptions);
  return Boolean(docId && !isEmpty(docId)) && isAlphaReleased && isRecord;
};

export const isDocumentNumericRelease = (revisionStage?: number) => revisionStage === 1;
export const isDocumentAlphaReleased = (revisionStage?: number) => revisionStage === 3;
