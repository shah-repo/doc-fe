import { groupBy, keyBy, keys, merge, omit, uniq } from "lodash";
import { combineReducers } from "redux";
import { AllIdsState, DocumentByIdState, DocumentRevisionAuditSetAction, DocumentRevisionsAllIdsState, DocumentRevisionsByIdState, DocumentRevisionSetAction, DocumentRevisionsListAction, DocumentSetAction, DOCUMENT_GET_ASYNC, DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_GET_ASYNC, DOCUMENT_REVISION_GET_AUDIT_ASYNC, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_LIST_ASYNC, DOCUMENT_REVISION_SET, DOCUMENT_SET } from ".";
import asyncReducer from "../../reducers/asyncReducer";
import { AuditByCRIdState } from "../audit";

type DocumentRevisionActions =
  | DocumentRevisionsListAction
  | DocumentRevisionSetAction;

const byId = (
  state: DocumentRevisionsByIdState = {},
  action: DocumentRevisionActions,
): DocumentRevisionsByIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_LIST: {
      const payloadById = keyBy(action.payload, "id");
      return merge(state, payloadById);
    }
    case DOCUMENT_REVISION_SET:
      if (!action.payload?.documentRevision) {
        if (action.payload?.requestBody && action.payload.docRevId) {
          const bodyKeys = keys(action.payload.requestBody);
          const newBody = merge(omit(state[action.payload.docRevId], bodyKeys), action.payload.requestBody);
          return { ...state, [action.payload.docRevId]: newBody };
        }
        return state;
      }
      return { ...state, [action.payload.documentRevision.id]: action.payload.documentRevision };
    default:
      return state;
  }
};

const allIds = (
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
      if (!action.payload?.documentRevision) {
        return state;
      }
      return uniq([...state, action.payload.documentRevision.id]);
    default:
      return state;
  }
};

type DocumentByIdAction = DocumentSetAction | DocumentRevisionActions;

const documentsById = (
  state: DocumentByIdState = {},
  action: DocumentByIdAction,
): DocumentByIdState => {
  switch (action.type) {
    case DOCUMENT_REVISION_SET:
      if (!action.payload?.documentRevision?.document) {
        return state;
      }
      return {
        ...state,
        [action.payload.documentRevision.document.id]: {
          ...state[action.payload.documentRevision.document.id],
          documentRevisions: (state[action.payload.documentRevision.document.id] || { documentRevisions: [] })
            .documentRevisions.map((docRev) => {
              if (docRev.id !== action.payload?.documentRevision?.id) {
                return docRev;
              }

              return merge(docRev, action.payload.documentRevision);
            }),
        },
      };
    case DOCUMENT_SET:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

const auditsByCRId = (
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

const auditsAllId = (
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
