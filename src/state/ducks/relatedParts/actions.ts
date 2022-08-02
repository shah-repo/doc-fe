/* eslint-disable no-console */
import { apiAction } from "../../factories";
import { DocumentRevisionEditRequestBody } from "../documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "./constants";
import { RelatedPartsChocieRequestBody } from "./types";

const createRelatedPart = (parentDocumentId: string, body: DocumentRevisionEditRequestBody) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}/child/separate`,
  method: "post",
  data: body,
});

const parentPartChoiceAction = (body: RelatedPartsChocieRequestBody) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/parent`,
  method: "post",
  data: body,
});


export default {
  createRelatedPart,
  parentPartChoiceAction,
};


