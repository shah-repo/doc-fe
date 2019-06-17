import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  DOCUMENT_REVISION_GET_ASYNC,
  DOCUMENT_REVISION_LIST,
  DOCUMENT_REVISION_LIST_ASYNC,
  DOCUMENT_REVISION_ROOT_URL,
  DOCUMENT_REVISION_SET,
  DOCUMENT_GET_ASYNC,
  DOCUMENT_SET,
  DOCUMENT_ROOT_URL,
} from "./constants";
import {
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  DocumentRevisionSetAction,
  DocumentRevisionsListAction,
  DocumentSetAction,
  Document,
} from "./types";

const documentRevisionsList = (documentRevisions: DocumentRevision[]): DocumentRevisionsListAction => ({
  type: DOCUMENT_REVISION_LIST,
  payload: documentRevisions,
});

const documentRevisionSet = (documentRevision: DocumentRevision): DocumentRevisionSetAction => ({
  type: DOCUMENT_REVISION_SET,
  payload: documentRevision,
});

const loadList = (): ApiAction<DocumentRevision[]> => apiAction({
  url: DOCUMENT_REVISION_ROOT_URL,
  method: "get",
  asyncType: DOCUMENT_REVISION_LIST_ASYNC,
  onSuccess: (documentRevisions, dispatch) => {
    dispatch(documentRevisionsList(documentRevisions));
  },
});

const load = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: "get",
  asyncType: DOCUMENT_REVISION_GET_ASYNC,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const save = (id: string, body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
  ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
    method: "patch",
    data: body,
    onSuccess: (documentRevision, dispatch) => {
      dispatch(documentRevisionSet(documentRevision));
    },
    handlers,
  });

const create = (body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
  ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
    url: DOCUMENT_REVISION_ROOT_URL,
    method: "post",
    data: body,
    onSuccess: (documentRevision, dispatch) => {
      dispatch(documentRevisionSet(documentRevision));
    },
    handlers,
  });

const documentSet = (document: Document): DocumentSetAction => ({
  type: DOCUMENT_SET,
  payload: document,
});

const loadDocument = (id: string): ApiAction<Document> => apiAction({
  url: `${DOCUMENT_ROOT_URL}/${id}`,
  method: "get",
  asyncType: DOCUMENT_GET_ASYNC,
  onSuccess: (document, dispatch) => {
    dispatch(documentSet(document));
  },
});

export default {
  documentRevisionsList,
  documentRevisionSet,
  loadList,
  load,
  save,
  create,
  loadDocument,
};
