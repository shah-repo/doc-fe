import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const LegalRecord: IdocumentTypeDto = {
  documentTypeName: "Legal Record",
  documentTypeAcronym: "LR-",
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  needsSignature: true,
  category: Categories.Record,
};

export const RecordOne: IdocumentTypeDto = {
  documentTypeName: "Record one",
  documentTypeAcronym: "RD-",
  group: DOC_TYPE_GROUP.RECORD,
  isQms: true,
  needsSignature: true,
  category: Categories.Record,
};
