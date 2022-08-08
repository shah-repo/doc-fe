/* eslint-disable no-console */
import { apiAction } from "../../factories";
import { DocumentRevisionEditRequestBody } from "../documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "./constants";
import { RelatedPartsChoiceRequestBody } from "./types";

const createRelatedPart =
  (parentDocumentId: string, body: DocumentRevisionEditRequestBody, async) => apiAction({
    url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}/child`,
    method: "post",
    data: body,
    onSuccess(data) {
      async.successHandler.callback(data);
    },
  });

const parentPartChoiceAction = (body: RelatedPartsChoiceRequestBody) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/parent`,
  method: "post",
  data: body,
});

const fetchAllRelatedParts =
  (parentDocumentId: string, async) => apiAction({
    url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}`,
    method: "get",
    onSuccess(data) {
      async.successHandler.callback(data);
    },
  });


export default {
  createRelatedPart,
  parentPartChoiceAction,
  fetchAllRelatedParts,
};


