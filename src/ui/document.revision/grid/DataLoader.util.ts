import { documentRevisionQueryStatus } from "../utils/helpers";

const TABLE_PAYLOAD_ITEMS_MAPPING = {
  documentRevisions: {
    documentTypeWithoutCategory: "true",
    status: documentRevisionQueryStatus(),
  },
};
export const getDefaultPayloadItems = (tableName: string) => TABLE_PAYLOAD_ITEMS_MAPPING[tableName] || {};
