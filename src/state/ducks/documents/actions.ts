import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  DOCUMENT_GET_ASYNC,
  DOCUMENT_PROPOSED_DOC_ID,
  DOCUMENT_PROPOSED_DOC_ID_ASYNC,
  DOCUMENT_PROPOSED_DOC_ID_SET,
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
  DocumentProposedId,
  DocumentProposedIdSetAction,
  DocumentSetAction,
  DocumentsToReviewListAction,
  DocumentTransition,
  DocumentTransitionRequestBody,
  DocumentTransitionResponse,
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

const documentProposedIdSet = (docId: string): DocumentProposedIdSetAction => ({
  type: DOCUMENT_PROPOSED_DOC_ID_SET,
  payload: docId,
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

const loadDocumentProposedId = (documentTypeAcronym: string): ApiAction<DocumentProposedId> => apiAction({
  url: DOCUMENT_PROPOSED_DOC_ID,
  method: "get",
  params: { documentTypeAcronym },
  asyncType: DOCUMENT_PROPOSED_DOC_ID_ASYNC,
  onSuccess: (documentProposedId, dispatch) => {
    dispatch(documentProposedIdSet(documentProposedId.docId || ""));
  },
});

const setDocumentProposedId = (docId: string): DocumentProposedIdSetAction => ({
  type: DOCUMENT_PROPOSED_DOC_ID_SET,
  payload: docId,
});

const create = (body: DocumentEditRequestBody, handlers: Handlers<Document>):
  ApiAction<Document, DocumentEditRequestBody> => apiActionWithCallbacks({
    url: DOCUMENTS_ROOT_URL,
    method: "post",
    data: body,
    onSuccess: (document, dispatch) => {
      dispatch(documentSet(document));
    },
    handlers,
  });

const save = (id: string, body: DocumentEditRequestBody, handlers: Handlers<Document>):
  ApiAction<Document, DocumentEditRequestBody> => apiActionWithCallbacks({
    url: `${DOCUMENTS_ROOT_URL}/${id}`,
    method: "patch",
    data: body,
    onSuccess: (document, dispatch) => {
      dispatch(documentSet(document));
    },
    handlers,
  });

const applyTransition = (
  id: string,
  body: DocumentTransitionRequestBody,
  transition: DocumentTransition,
  handlers: Handlers<DocumentTransitionResponse>,
): ApiAction<DocumentTransitionResponse, DocumentTransitionRequestBody> => apiActionWithCallbacks({
  url: `${DOCUMENTS_ROOT_URL}/${id}/${transition}`,
  method: "post",
  data: body,
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
  },
  handlers,
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
  applyTransition,
  loadDocumentProposedId,
  setDocumentProposedId,
};
