import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

const CPName = "Clinical Protocol";
const CPAcronym = "CP-";

export const ClinicalProtocolNotRedline: IdocumentTypeDto = {
  documentTypeName: CPName,
  documentTypeAcronym: CPAcronym,
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  schema: [{
    index: 0,
    name: ATTACHMENT_BUILT_IN_KEY,
    label: "Attachments",
    type: ATTACHMENTS,
    applicableOn: [
      ON_STATE_TO_IN_REVIEW,
    ],
    deleteDisabled: true,
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
    tabId: "overview",
  }],
};

export const ClinicalProtocolDocType: IdocumentTypeDto = {
  documentTypeName: CPName,
  documentTypeAcronym: CPAcronym,
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  canRedLine: true,
};

export const ClinicalProtocolPrivatePoolDocType: IdocumentTypeDto = {
  documentTypeName: CPName,
  documentTypeAcronym: CPAcronym,
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  privateNumberPool: true,
  startingNumber: 1,
};

export const CPExport: IdocumentTypeDto = {
  documentTypeName: CPName,
  documentTypeAcronym: "CP",
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
};
