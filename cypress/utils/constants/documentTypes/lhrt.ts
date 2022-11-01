import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

export const LHRTTest: IdocumentTypeDto = {
  documentTypeName: "LHR template",
  documentTypeAcronym: "LHRT-",
  group: DOC_TYPE_GROUP.LHRT, // check if this needs to be LHRT group instead.
};

export const LHRT: IdocumentTypeDto = {
  documentTypeName: "LHR template",
  documentTypeAcronym: "LHRT-",
  group: DOC_TYPE_GROUP.LHRT,
};
