import { DocumentType, DocumentTypeByCategoryAction, DocumentTypeById, DocumentTypeByIdAction, DocumentTypeListAction, DOCUMENT_TYPE_BY_CATEGORY_ASYNC, DOCUMENT_TYPE_BY_GROUP_ASYNC, DOCUMENT_TYPE_BY_ID, DOCUMENT_TYPE_BY_ID_ASYNC, DOCUMENT_TYPE_LIST, DOCUMENT_TYPE_LIST_ASYNC, DOCUMENT_TYPE_ROOT_URL, SET_DOCUMENT_TYPES_BY_CATEGORY } from ".";
import { APPROVAL_MATRIX_URL, PO_APPROVAL_MATRIX_URL } from "../../../../ui/form.builder/FBApprovalMatrix/constants";
import { ApprovalMatrix } from "../../../../ui/form.builder/FBApprovalMatrix/FBApprovalMatrix.types";
import { apiAction, apiActionWithCallbacks } from "../../../factories";
import { ApiAction, Handlers } from "../../../types";

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

const getDocTypesByCategory = (
  params: { category: string},
  handlers: Handlers,
): ApiAction<DocumentType[]> =>
  apiActionWithCallbacks({
    url: DOCUMENT_TYPE_ROOT_URL,
    asyncType: DOCUMENT_TYPE_BY_CATEGORY_ASYNC,
    method: "get",
    params,
    handlers,
    onSuccess: (documentTypes, dispatch) => {
      dispatch(setDocTypesByCategory(documentTypes));
    },
  });

const setDocTypesByCategory = (documentTypes: DocumentType[]): DocumentTypeByCategoryAction => ({
  type: SET_DOCUMENT_TYPES_BY_CATEGORY,
  payload: documentTypes,
});

const getDocTypeByGroup = (
  params: any = {},
  handlers: Handlers,
): ApiAction<DocumentType[]> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_TYPE_ROOT_URL}/with_forms`,
    asyncType: DOCUMENT_TYPE_BY_GROUP_ASYNC,
    method: "get",
    params,
    handlers,
  });

const getApprovalMatrix = (handlers: Handlers): ApiAction<ApprovalMatrix> => apiActionWithCallbacks({
  url: APPROVAL_MATRIX_URL,
  method: "get",
  handlers,
});

const getPOApprovalMatrix = (handlers: Handlers): ApiAction<ApprovalMatrix> => apiActionWithCallbacks({
  url: PO_APPROVAL_MATRIX_URL,
  method: "get",
  handlers,
});

const updateDocumentType = (
  id: string,
  body: DocumentType,
  handlers: Handlers
): ApiAction<DocumentType[]> => apiActionWithCallbacks({
  url: `${DOCUMENT_TYPE_ROOT_URL}/${id}`,
  method: "patch",
  data: body,
  onSuccess: (m, dispatch) => {
    dispatch(loadList());
  },
  handlers,
});

const deleteDocumentType = (id: string): ApiAction<DocumentType[]> => apiAction({
  url: `${DOCUMENT_TYPE_ROOT_URL}/remove/${id}`,
  method: "delete",
  onSuccess: (m, dispatch) => {
    dispatch(loadList());
  },
});

const addDocumentType = (
  body: DocumentType,
  handlers: Handlers,
): ApiAction<DocumentType[]> => apiActionWithCallbacks({
  url: `${DOCUMENT_TYPE_ROOT_URL}/add`,
  method: "post",
  data: body,
  onSuccess: (m, dispatch) => {
    dispatch(loadList());
  },
  handlers,
});

export default {
  loadList,
  getDocTypeIds,
  getApprovalMatrix,
  getPOApprovalMatrix,
  getDocTypeByGroup,
  getDocTypesByCategory,
  updateDocumentType,
  deleteDocumentType,
  addDocumentType,
};
