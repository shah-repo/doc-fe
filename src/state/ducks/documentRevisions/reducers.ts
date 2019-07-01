import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import {
  DOCUMENT_REVISION_GET_ASYNC,
  DOCUMENT_REVISION_SET,
  DOCUMENT_REVISION_LIST,
  DOCUMENT_REVISION_LIST_ASYNC,
  DOCUMENT_SET,
  DOCUMENT_GET_ASYNC,
  DOCUMENT_REVISION_AUDIT_SET,
  DOCUMENT_REVISION_GET_AUDIT_ASYNC,
} from "./constants";
import {
  DocumentRevision,
  DocumentRevisionsListAction,
  DocumentRevisionsAllIdsState,
  DocumentRevisionsByIdState,
  DocumentRevisionSetAction,
  DocumentSetAction,
  DocumentByIdState,
  DocumentRevisionAuditSetAction,
  AuditByCRIdState,
  AllIdsState,
} from "./types";

type DocumentRevisionActions = DocumentRevisionsListAction | DocumentRevisionSetAction;

export const byId = (state: DocumentRevisionsByIdState = {}, action: DocumentRevisionActions): DocumentRevisionsByIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_LIST:
      return { ...state, ...(_.keyBy<DocumentRevision>(action.payload, (documentRevision) => documentRevision.id)) };
    case DOCUMENT_REVISION_SET:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export const allIds = (state: DocumentRevisionsAllIdsState = [], action: DocumentRevisionActions): DocumentRevisionsAllIdsState => {
  switch (action.type) {
    case DOCUMENT_REVISION_LIST:
      return _.uniq([...state, ...action.payload.map((documentRevision) => documentRevision.id)]);
    case DOCUMENT_REVISION_SET:
      return _.uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export const documentsById = (state: DocumentByIdState = {}, action: DocumentSetAction): DocumentByIdState => {
  switch (action.type) {
    case DOCUMENT_SET:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export const auditsByCRId = (state: AuditByCRIdState = {}, action: DocumentRevisionAuditSetAction): AuditByCRIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_AUDIT_SET:
      return { ...state, [action.payload.id]: action.payload.audit };
    default:
      return state;
  }
};

export const auditsAllId = (state: AllIdsState = [], action: DocumentRevisionAuditSetAction): AllIdsState => {
  switch (action.type) {
    case DOCUMENT_REVISION_AUDIT_SET:
      return _.uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export default combineReducers({
  loadListAsyncInfo: asyncReducer(DOCUMENT_REVISION_LIST_ASYNC),
  loadAsyncInfo: asyncReducer(DOCUMENT_REVISION_GET_ASYNC),
  loadDocumentAsyncInfo: asyncReducer(DOCUMENT_GET_ASYNC),
  loadAuditAsyncInfo: asyncReducer(DOCUMENT_REVISION_GET_AUDIT_ASYNC),
  byId,
  allIds,
  documentsById,
  auditsByCRId,
  auditsAllId
});
