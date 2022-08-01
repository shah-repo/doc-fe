/* eslint-disable no-console */
import { apiAction } from "../../factories";
import { DocumentRevisionEditRequestBody } from "../documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "./constants";

const createRelatedPart = (parentDocumentId: string, body: DocumentRevisionEditRequestBody) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}/child/separate`,
  method: "post",
  data: body,
});

export default {
  createRelatedPart,
};
