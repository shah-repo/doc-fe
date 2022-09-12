import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

export const AdministrativeDocumentDocType: IdocumentTypeDto = {
  documentTypeName: "Administrative",
  documentTypeAcronym: "ADM-",
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  canRedLine: true,
};
