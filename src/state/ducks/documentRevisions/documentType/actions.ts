import { apiAction } from "../../../factories";
import { ApiAction } from "../../../types";
import { DOCUMENT_TYPE_LIST, DOCUMENT_TYPE_LIST_ASYNC, DOCUMENT_TYPE_ROOT_URL } from "./constants";
import { DocumentType, DocumentTypeListAction } from "./types";

const documentTypesList = (documentTypes: DocumentType[]): DocumentTypeListAction => ({
  type: DOCUMENT_TYPE_LIST,
  payload: documentTypes,
});

const loadList = (): ApiAction<DocumentType[]> => apiAction({
  url: DOCUMENT_TYPE_ROOT_URL,
  method: "get",
  asyncType: DOCUMENT_TYPE_LIST_ASYNC,
  onSuccess: (documentTypes, dispatch) => {
    dispatch(documentTypesList(documentTypes));
  },
});

export default {
  loadList,
};
