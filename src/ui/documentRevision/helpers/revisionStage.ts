import { isEmpty } from "lodash";
import { IntlShape } from "react-intl";
import { REVISION_STAGE_OPTIONS } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentRecord } from "./checkDocumentGroup";

export const getIsAdministrativeDefault = (documentRevision: DocumentRevision) => {
  const docId = documentRevision.formDocument?.document?.docId;
  const isAlphaReleased = isDocumentAlphaReleased(documentRevision.revisionStage);
  const isRecord = checkIsDocumentRecord(documentRevision.document?.documentType?.groupOptions);
  return Boolean(docId && !isEmpty(docId)) && isAlphaReleased && isRecord;
};

export const isDocumentNumericRelease = (revisionStage?: number) => revisionStage === 1;
export const isDocumentAlphaReleased = (revisionStage?: number) => revisionStage === 3;

export const getRevisionStageNumber = (intl: IntlShape, revisionStageName: string) => {
  const revisionStageByName = Object.values(REVISION_STAGE_OPTIONS).map((value, index) =>
    ({ [intl.formatMessage({ id: value })]: (index + 1).toString() })
  );
  return Object.assign({}, ...revisionStageByName)[revisionStageName];
};
