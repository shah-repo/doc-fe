import CallbackHandler from "../../../common/callbackHandler";
import { apiAction, resetAsyncStateAction } from "../../factories";
import { ActionWithPayload, ApiAction, ApiActionMethod, AsyncActionPayload } from "../../types";
import {
  DOCUMENT_GET_ASYNC,
  DOCUMENT_SAVE_ASYNC,
  DOCUMENT_SET,
  DOCUMENTS_LIST,
  DOCUMENTS_LIST_ASYNC,
  DOCUMENTS_ROOT_URL,
  DOCUMENTS_TO_REVIEW_LIST,
  DOCUMENTS_TO_REVIEW_LIST_ASYNC,
  DOCUMENTS_TO_REVIEW_URL,
} from "./constants";
import {
  Document,
  DocumentEditRequestBody,
  DocumentListAction,
  DocumentSetAction,
  DocumentsToReviewListAction,
} from "./types";

const documentsList = (documents: Document[]): DocumentListAction => ({
  type: DOCUMENTS_LIST,
  payload: documents,
});

const documentsToReviewList = (documents: Document[]): DocumentsToReviewListAction => ({
  type: DOCUMENTS_TO_REVIEW_LIST,
  payload: documents,
});

const documentSet = (document: Document): DocumentSetAction => ({
  type: DOCUMENT_SET,
  payload: document,
});

const loadList = (): ApiAction<Document[]> => apiAction({
  url: DOCUMENTS_ROOT_URL,
  method: "get",
  asyncType: DOCUMENTS_LIST_ASYNC,
  onSuccess: (documents, dispatch) => {
    dispatch(documentsList(documents));
  },
});

const loadReviewList = (): ApiAction<Document[]> => apiAction({
  url: DOCUMENTS_TO_REVIEW_URL,
  method: "get",
  asyncType: DOCUMENTS_TO_REVIEW_LIST_ASYNC,
  onSuccess: (documents, dispatch) => {
    dispatch(documentsToReviewList(documents));
  },
});

const load = (id: string): ApiAction<Document> => apiAction({
  url: `${DOCUMENTS_ROOT_URL}/${id}`,
  method: "get",
  asyncType: DOCUMENT_GET_ASYNC,
  onSuccess: (document, dispatch) => {
    dispatch(documentSet(document));
  },
});

const resetDocumentSaveAsyncStatus = (): ActionWithPayload<AsyncActionPayload> =>
  resetAsyncStateAction(DOCUMENT_SAVE_ASYNC);

const create = (body: DocumentEditRequestBody, successHandler: CallbackHandler<Document>):
  ApiAction<Document, DocumentEditRequestBody> => apiAction({
    url: DOCUMENTS_ROOT_URL,
    method: "post",
    data: body,
    asyncType: DOCUMENT_SAVE_ASYNC,
    onSuccess: (document, dispatch) => {
      dispatch(documentSet(document));
      successHandler.execute(document);
    },
  });

const save = (id: string, body: DocumentEditRequestBody): ApiAction<Document, DocumentEditRequestBody> => apiAction({
  url: `${DOCUMENTS_ROOT_URL}/${id}`,
  method: "patch",
  data: body,
  asyncType: DOCUMENT_SAVE_ASYNC,
  onSuccess: (document, dispatch) => {
    dispatch(documentSet(document));
  },
});

export default {
  documentsList,
  documentsToReviewList,
  documentSet,
  loadList,
  load,
  loadReviewList,
  create,
  save,
  resetDocumentSaveAsyncStatus,
};
