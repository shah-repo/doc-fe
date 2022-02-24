import { filter, find } from "lodash";
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { documentRevisionEffectiveDateOption, documentRevisionQueryStatus } from "../utils/helpers";

const TABLE_PAYLOAD_ITEMS_MAPPING = {
  documentRevisions: {
    documentTypeWithoutCategory: "true",
    status: documentRevisionQueryStatus(),
  },
};
export const getDefaultPayloadItems = (tableName: string) => TABLE_PAYLOAD_ITEMS_MAPPING[tableName] || {};
export const getQueryURL = (tableName: string) => {
  if (["documentRevisions"].includes(tableName)) {
    return DOCUMENT_REVISION_SEARCH_ROOT_URL;
  }
};
export const getDynamicPayloadItems = (tableName: string, payload) => {
  const field = find(payload.filters, { field: "effectiveDate" });
  switch (tableName) {
    case "documentRevisions":
      if (field && field.value === "effectiveDate") {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.effectiveDate = find(effectiveDateOptions, { text: field.value })?.value;
        payload.filters = filter(payload.filters, (el) => el.field !== "effectiveDate");
      }
      break;
    default:
  }
  return payload;
};
