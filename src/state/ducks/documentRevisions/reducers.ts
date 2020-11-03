import { groupBy, keyBy, merge, uniq } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { AuditByCRIdState } from "../audit/types";
import { DOCUMENT_GET_ASYNC, DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_GET_ASYNC, DOCUMENT_REVISION_GET_AUDIT_ASYNC, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_LIST_ASYNC, DOCUMENT_REVISION_SET, DOCUMENT_SET } from "./constants";
import { AllIdsState, DocumentByIdState, DocumentRevisionAuditSetAction, DocumentRevisionsAllIdsState, DocumentRevisionsByIdState, DocumentRevisionSetAction, DocumentRevisionsListAction, DocumentSetAction } from "./types";

type DocumentRevisionActions =
  | DocumentRevisionsListAction
  | DocumentRevisionSetAction;

export const byId = (
  state: DocumentRevisionsByIdState = {},
  action: DocumentRevisionActions,
): DocumentRevisionsByIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_LIST: {
      const payloadById = keyBy(action.payload, "id");
      return merge(state, payloadById);
    }
    case DOCUMENT_REVISION_SET:
      if (!action.payload) {
        return state;
      }
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export const allIds = (
  state: DocumentRevisionsAllIdsState = [],
  action: DocumentRevisionActions,
): DocumentRevisionsAllIdsState => {
  switch (action.type) {
    case DOCUMENT_REVISION_LIST:
      return uniq([
        ...state,
        ...action.payload.map((documentRevision) => documentRevision.id),
      ]);
    case DOCUMENT_REVISION_SET:
      if (!action.payload) {
        return state;
      }
      return uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

type DocumentByIdAction = DocumentSetAction | DocumentRevisionActions;

export const documentsById = (
  state: DocumentByIdState = {},
  action: DocumentByIdAction,
): DocumentByIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_SET:
      if (!action.payload) {
        return state;
      }
      if (!action.payload.document) {
        return state;
      }
      return {
        ...state,
        [action.payload.document.id]: {
          ...state[action.payload.document.id],
          documentRevisions: (state[action.payload.document.id] || { documentRevisions: [] })
            .documentRevisions.map((docRev) => {
              if (docRev.id !== action.payload.id) {
                return docRev;
              }

              return merge(docRev, action.payload);
            }),
        },
      };
    case DOCUMENT_SET:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export const auditsByCRId = (
  state: AuditByCRIdState = {},
  action: DocumentRevisionAuditSetAction,
): AuditByCRIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_AUDIT_SET: {
      const audits = groupBy(action.payload.audit, "groupId");
      return { ...state, [action.payload.id]: audits };
    }
    default:
      return state;
  }
};

export const auditsAllId = (
  state: AllIdsState = [],
  action: DocumentRevisionAuditSetAction,
): AllIdsState => {
  switch (action.type) {
    case DOCUMENT_REVISION_AUDIT_SET:
      return uniq([...state, action.payload.id]);
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
  auditsAllId,
});
