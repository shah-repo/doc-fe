import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import {
  DOCUMENT_GET_ASYNC,
  DOCUMENT_SET,
  DOCUMENTS_LIST,
  DOCUMENTS_LIST_ASYNC,
  DOCUMENTS_TO_REVIEW_LIST,
  DOCUMENTS_TO_REVIEW_LIST_ASYNC,
} from "./constants";
import {
  Document,
  DocumentListAction,
  DocumentsAllIdsState,
  DocumentsByIdState,
  DocumentSetAction,
  DocumentsReviewIdsState,
  DocumentsToReviewListAction,
} from "./types";

type DocumentActions = DocumentListAction | DocumentSetAction | DocumentsToReviewListAction;

export const byId = (state: DocumentsByIdState = {}, action: DocumentActions): DocumentsByIdState => {
  switch (action.type) {
    case DOCUMENTS_LIST:
    case DOCUMENTS_TO_REVIEW_LIST:
      return { ...state, ...(_.keyBy<Document>(action.payload, (document) => document.id)) };
    case DOCUMENT_SET:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export const allIds = (state: DocumentsAllIdsState = [], action: DocumentActions): DocumentsAllIdsState => {
  switch (action.type) {
    case DOCUMENTS_LIST:
    case DOCUMENTS_TO_REVIEW_LIST:
      return _.uniq([...state, ...action.payload.map((document) => document.id)]);
    case DOCUMENT_SET:
      return _.uniq([...state, action.payload.id]);
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

export default combineReducers({
  loadListAsyncInfo: asyncReducer(DOCUMENTS_LIST_ASYNC),
  loadReviewListAsyncInfo: asyncReducer(DOCUMENTS_TO_REVIEW_LIST_ASYNC),
  loadAsyncInfo: asyncReducer(DOCUMENT_GET_ASYNC),
  byId,
  allIds,
  reviewIds,
});
