import { apiAction, apiActionWithCallbacks } from "../../../factories";
import { ApiAction, Handlers } from "../../../types";
import { Group } from "../../auth/types";
import { DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_BY_ID_ASYNC, DOCUMENT_TYPE_LIST, DOCUMENT_TYPE_LIST_ASYNC, DOCUMENT_TYPE_ROOT_URL } from "./constants";
import { DocumentType, DocumentTypeById, DocumentTypeByIdAction, DocumentTypeListAction } from "./types";

const documentTypesList = (documentTypes: DocumentType[]): DocumentTypeListAction => ({
  type: DOCUMENT_TYPE_LIST,
  payload: documentTypes,
});

const docTypeIds = (docTypeIds: DocumentTypeById): DocumentTypeByIdAction => ({
  type: DOCUMENT_TYPE_BY_ID,
  payload: docTypeIds,
});

const loadList = (): ApiAction<DocumentType[]> => apiAction({
  url: DOCUMENT_TYPE_ROOT_URL,
  method: "get",
  asyncType: DOCUMENT_TYPE_LIST_ASYNC,
  onSuccess: (documentTypes, dispatch) => {
    dispatch(documentTypesList(documentTypes));
  },
});

const getDocTypeIds = (id: string, handlers: Handlers): ApiAction<DocumentTypeById> => apiActionWithCallbacks({
  url: `${DOCUMENT_TYPE_ROOT_URL}/${id}`,
  method: "get",
  asyncType: DOCUMENT_TYPE_BY_ID_ASYNC,
  onSuccess: (documentTypes, dispatch) => {
    dispatch(docTypeIds(documentTypes));
  },
  handlers,
});

const loadGroupsByStage = (id: string, stage: number, handlers: Handlers): ApiAction<Group[]> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_TYPE_ROOT_URL}/${id}/required_approvers/${stage}`,
    method: "get",
    handlers,
  });

export default {
  loadList,
  getDocTypeIds,
  loadGroupsByStage,
};
