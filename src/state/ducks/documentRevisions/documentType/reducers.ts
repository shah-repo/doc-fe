import { keyBy, uniq } from "lodash";
import { combineReducers } from "redux";
import { DocRevByIdState, DocumentType, DocumentTypeAllIdsState, DocumentTypeByCategoryAction, DocumentTypeByCategoryState, DocumentTypeByIdAction, DocumentTypeByIdState, DocumentTypeListAction, DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_LIST, DOCUMENT_TYPE_LIST_ASYNC, SET_DOCUMENT_TYPES_BY_CATEGORY } from ".";
import asyncReducer from "../../../reducers/asyncReducer";

type DocumentTypeActions =  DocumentTypeListAction;

const byId = (state: DocumentTypeByIdState = {}, action: DocumentTypeActions): DocumentTypeByIdState => {
  switch (action.type) {
    case DOCUMENT_TYPE_LIST:
      return { ...(keyBy<DocumentType>(action.payload, (documentType) => documentType.id)) };
    default:
      return state;
  }
};

const allIds = (state: DocumentTypeAllIdsState = [], action: DocumentTypeActions): DocumentTypeAllIdsState => {
  switch (action.type) {
    case DOCUMENT_TYPE_LIST:
      return uniq([...action.payload.map((documentType) => documentType.id)]);
    default:
      return state;
  }
};

const DOC_REV_BY_ID_DEFAULT_STATE: DocRevByIdState = {
  documentType: {
    id: "",
    documentTypeAcronym: "",
    documentTypeName: "",
    group: "OTHER",
    isQms: true,
    defaultTraining: false,
  },
  forms: [
    {
      id: "",
      name: "",
      document: {
        id: "",
      },
    },
  ],
};

const docRevTypeId = (
  state: DocRevByIdState = DOC_REV_BY_ID_DEFAULT_STATE,
  action: DocumentTypeByIdAction
): DocRevByIdState => {
  switch (action.type) {
    case DOCUMENT_TYPE_BY_ID:
      return { ...action.payload };
    default:
      return state;
  }
};

const docTypesByCategory = (
  state: DocumentTypeByCategoryState = [],
  action: DocumentTypeByCategoryAction,
): DocumentTypeByCategoryState => {
  switch (action.type) {
    case SET_DOCUMENT_TYPES_BY_CATEGORY:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadListAsyncInfo: asyncReducer(DOCUMENT_TYPE_LIST_ASYNC),
  byId,
  allIds,
  docRevTypeId,
  docTypesByCategory,
});
