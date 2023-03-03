import { apiAction } from "../../factories";
import { DOCUMENT_REVISION_ROOT_URL } from "../documentRevisions/constants";
import { DocumentRevision, DocumentRevisionEditRequestBody, RevisionChangeType } from "../documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "./constants";
import { RelatedPartsChoiceRequestBody, RelatedPartsListItem } from "./types";


const createRelatedPart =
  (parentDocumentId: string, parentDocumentRevisionId: string, body: DocumentRevisionEditRequestBody,
    suffixName, async) => apiAction({
    url: `${RELATED_PARTS_ROOT_URL}/${parentDocumentId}/${parentDocumentRevisionId}/child`,
    method: "post",
    data: body,
    onSuccess: (createdRelatedPart) => {
      async.successHandler?.callback({ createdRelatedPart });
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
  (documentRevisionId: string, revisionChangeType: RevisionChangeType, async) => apiAction({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${documentRevisionId}`,
    method: "patch",
    data: { revisionChangeType },
    onSuccess: (documentRevision: DocumentRevision) => {
      async.successHandler?.callback(
        {
          docRevId: documentRevisionId,
          name: documentRevision.name,
          revisionChangeType: documentRevision.revisionChangeType,
        });
    },
  });

const removeRelatedPart = (docRevId: string, async) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/${docRevId}`,
  method: "delete",
  onSuccess() {
    if (async.successHandler?.callback) {
      async.successHandler?.callback({ docRevId });
    }
  },
});

const updateRelatedPart = (docRevId: string, data, async) => apiAction({
  url: `${RELATED_PARTS_ROOT_URL}/${docRevId}`,
  method: "patch",
  data,
  onSuccess( relatedPart: RelatedPartsListItem) {
    if (async.successHandler?.callback) {
      async.successHandler?.callback(
        {
          docRevId,
          suffixNumber: relatedPart.suffixNumber,
          suffixName: relatedPart.suffixName,
          rootDocId: relatedPart.rootDocId,
        });
    }
  },
});


export default {
  createRelatedPart,
  parentPartChoiceAction,
  fetchAllRelatedParts,
  voidRelatedPart,
  removeRelatedPart,
  updateRelatedPart,
};
