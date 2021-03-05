import { isEmpty } from "lodash";
import { IntlShape } from "react-intl";
import { DocumentRevision, RevisionStageOptions } from "../../../state/ducks/documentRevisions/types";
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
  const revisionStageByName = RevisionStageOptions.map((option) =>
    ({ [intl.formatMessage({ id: option.text })]: option.value.toString() })
  );
  return Object.assign({}, ...revisionStageByName)[revisionStageName];
};
