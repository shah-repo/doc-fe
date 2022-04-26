import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const Material: IdocumentTypeDto = {
  documentTypeName: "Material",
  documentTypeAcronym: "MT-",
  group: DOC_TYPE_GROUP.MATERIAL,
  isQms: true,
  needsSignature: true,
  category: Categories.Materials,
};
