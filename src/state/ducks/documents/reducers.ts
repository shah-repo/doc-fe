import { uniq } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { DOCUMENTS_LIST, DOCUMENTS_LIST_ASYNC, DOCUMENTS_TO_REVIEW_LIST, DOCUMENTS_TO_REVIEW_LIST_ASYNC, DOCUMENT_GET_ASYNC, DOCUMENT_PROPOSED_DOC_ID_ASYNC, DOCUMENT_PROPOSED_DOC_ID_SET, DOCUMENT_SET } from "./constants";
import { Document, DocumentListAction, DocumentProposedIdSetAction, DocumentsAllIdsState, DocumentsByIdState, DocumentSetAction, DocumentsReviewIdsState, DocumentsToReviewListAction } from "./types";

type DocumentActions = DocumentListAction | DocumentSetAction | DocumentsToReviewListAction;

const extendDocument = (document: Document): Document => (
  { owner: {}, approvals: [], attachments: [], ...document }
);

const keyByDocumentIdReducer = (acc: DocumentsByIdState, document: Document): DocumentsByIdState => (
  { ...acc, [document.id]: extendDocument(document) }
);

export const byId = (state: DocumentsByIdState = {}, action: DocumentActions): DocumentsByIdState => {
  switch (action.type) {
    case DOCUMENTS_LIST:
    case DOCUMENTS_TO_REVIEW_LIST:
      return action.payload.reduce(keyByDocumentIdReducer, state);
      // return { ...state, ...(keyBy<Document>(action.payload, (document) => document.id)) };
    case DOCUMENT_SET:
      return { ...state, [action.payload.id]: extendDocument(action.payload) };
    default:
      return state;
  }
};

export const allIds = (state: DocumentsAllIdsState = [], action: DocumentActions): DocumentsAllIdsState => {
  switch (action.type) {
    case DOCUMENTS_LIST:
    case DOCUMENTS_TO_REVIEW_LIST:
      return uniq([...state, ...action.payload.map((document) => document.id)]);
    case DOCUMENT_SET:
      return uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export const reviewIds = (
  state: DocumentsReviewIdsState = [],
  action: DocumentsToReviewListAction,
): DocumentsReviewIdsState => {
  if (action.type === DOCUMENTS_TO_REVIEW_LIST) {
    return action.payload.map((document) => document.id);
  }

  return state;
};

const proposedDocId = (state = "", action: DocumentProposedIdSetAction): string => {
  if (action.type === DOCUMENT_PROPOSED_DOC_ID_SET) {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  loadListAsyncInfo: asyncReducer(DOCUMENTS_LIST_ASYNC),
  loadReviewListAsyncInfo: asyncReducer(DOCUMENTS_TO_REVIEW_LIST_ASYNC),
  loadAsyncInfo: asyncReducer(DOCUMENT_GET_ASYNC),
  loadProposedDocIdAsyncInfo: asyncReducer(DOCUMENT_PROPOSED_DOC_ID_ASYNC),
  byId,
  allIds,
  reviewIds,
  proposedDocId,
});
