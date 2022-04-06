import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

const CPName = "Clinical Protocol";
const CPAcronym = "CP-";

export const ClinicalProtocolDocType: IdocumentTypeDto = {
  documentTypeName: CPName,
  documentTypeAcronym: CPAcronym,
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
};
