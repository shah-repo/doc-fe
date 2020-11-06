import { isEmpty } from "lodash";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { checkIsDocumentRecord } from "./checkDocumentGroup";

export const getIsAdministrativeDefault = (documentRevision: DocumentRevision) => {
  const docId = documentRevision.formDocument?.document?.docId;
  const isAlphaReleased = documentRevision.revisionStage === 3;
  const isRecord = checkIsDocumentRecord(documentRevision.document?.documentType?.groupOptions);
  return Boolean(docId && !isEmpty(docId)) && isAlphaReleased && isRecord;
};
