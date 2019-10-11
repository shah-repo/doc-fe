import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../../reducers/asyncReducer";
import {
  DOCUMENT_TYPE_LIST,
  DOCUMENT_TYPE_LIST_ASYNC,
} from "./constants";
import {
  DocumentType,
  DocumentTypeAllIdsState,
  DocumentTypeByIdState,
  DocumentTypeListAction,
} from "./types";

type DocumentTypeActions =  DocumentTypeListAction;

export const byId = (state: DocumentTypeByIdState = {}, action: DocumentTypeActions): DocumentTypeByIdState => {
  switch (action.type) {
    case DOCUMENT_TYPE_LIST:
      return { ...(_.keyBy<DocumentType>(action.payload, (documentType) => documentType.id)) };
    default:
      return state;
  }
};

export const allIds = (state: DocumentTypeAllIdsState = [], action: DocumentTypeActions): DocumentTypeAllIdsState => {
  switch (action.type) {
    case DOCUMENT_TYPE_LIST:
      return _.uniq([...action.payload.map((documentType) => documentType.id)]);
    default:
      return state;
  }
};

export default combineReducers({
  loadListAsyncInfo: asyncReducer(DOCUMENT_TYPE_LIST_ASYNC),
  byId,
  allIds,
});
