import { apiAction } from "../../factories";
import { DOCUMENT_REVISION_ROOT_URL } from "../documentRevisions/constants";
import { DocumentRevision, DocumentRevisionEditRequestBody } from "../documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "./constants";
import { RelatedPartsChoiceRequestBody } from "./types";


const createRelatedPart =
  (parentDocumentId: string, parentDocumentRevisionId: string, body: DocumentRevisionEditRequestBody,
    suffixName, async) => apiAction({
    url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}/${parentDocumentRevisionId}/child`,
    method: "post",
    data: body,
    onSuccess: (document) => {
      async.successHandler?.callback({ createdDocumentRevision: document, suffixName });
    },
  });

const parentPartChoiceAction = (body: RelatedPartsChoiceRequestBody, async) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/parent`,
  method: "post",
  data: body,
  onSuccess(data) {
    async.successHandler?.callback(data);
  },
});

const fetchAllRelatedParts =
  (parentDocumentId: string, async) => apiAction({
    url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}`,
    method: "get",
    onSuccess(data) {
      if (async.successHandler?.callback) {
        async.successHandler?.callback(data);
      }
    },
  });

const voidRelatedPart =
  (documentRevisionId: string, async) => apiAction({
    url: `${DOCUMENT_REVISION_ROOT_URL}/void/${documentRevisionId}`,
    method: "patch",
    onSuccess: (documentRevision: DocumentRevision) => {
      async.successHandler?.callback({ docRevId: documentRevisionId, name: documentRevision.name });
    },
  });


export default {
  createRelatedPart,
  parentPartChoiceAction,
  fetchAllRelatedParts,
  voidRelatedPart,
};
