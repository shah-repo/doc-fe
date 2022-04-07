import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

export const EForm: IdocumentTypeDto = {
  documentTypeName: "E Form",
  documentTypeAcronym: "EFM-",
  group: DOC_TYPE_GROUP.FORM,
  isQms: true,
};
