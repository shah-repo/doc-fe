import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

export const FormOperatorsType: IdocumentTypeDto = {
  documentTypeName: "Form Operators",
  documentTypeAcronym: "FO-",
  group: DOC_TYPE_GROUP.FORM,
  isQms: true,
};
