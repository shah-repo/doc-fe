import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const Part: IdocumentTypeDto =   {
  documentTypeName: "Part",
  documentTypeAcronym: "PRT-",
  group: DOC_TYPE_GROUP.PART,
  isQms: true,
  needsSignature: true,
  category: Categories.Parts,
};
