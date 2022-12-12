import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

const GDName = "General Document";
const CGDAcronym = "GD-";

export const GeneralDocumentDocType: IdocumentTypeDto = {
  documentTypeName: GDName,
  documentTypeAcronym: CGDAcronym,
  group: DOC_TYPE_GROUP.OTHER,
  isQms: true,
  canRedLine: true,
};
