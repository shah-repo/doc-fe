import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const Supplier: IdocumentTypeDto = {
  documentTypeName: "Supplier",
  documentTypeAcronym: "SUP-",
  group: DOC_TYPE_GROUP.SUPPLIER,
  isQms: true,
  needsSignature: true,
  category: Categories.Suppliers,
};
