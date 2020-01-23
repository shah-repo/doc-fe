import { Password } from "../../../ui/components/password/types";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { Audit, AuditActionPayload } from "../audit/types";
import { documentsActions } from "../documents";
import {
  DOCUMENT_GET_ASYNC,
  DOCUMENT_REVISION_AUDIT_SET,
  DOCUMENT_REVISION_GET_ASYNC,
  DOCUMENT_REVISION_GET_AUDIT_ASYNC,
  DOCUMENT_REVISION_LIST,
  DOCUMENT_REVISION_LIST_ASYNC,
  DOCUMENT_REVISION_ROOT_URL,
  DOCUMENT_REVISION_SET,
  DOCUMENT_ROOT_URL,
  DOCUMENT_SET,
} from "./constants";
import {
  Document,
  DocumentRevision,
  DocumentRevisionAuditSetAction,
  DocumentRevisionEditRequestBody,
  DocumentRevisionSetAction,
  DocumentRevisionsListAction,
  DocumentRevisionStatus,
  DocumentRevisionTransition,
  DocumentRevisionTransitionRequestBody,
  DocumentRevisionTransitionResponse,
  DocumentSetAction,
} from "./types";

const documentRevisionsList = (documentRevisions: DocumentRevision[]): DocumentRevisionsListAction => ({
  type: DOCUMENT_REVISION_LIST,
  payload: documentRevisions,
});

const documentRevisionSet = (documentRevision: DocumentRevision): DocumentRevisionSetAction => ({
  type: DOCUMENT_REVISION_SET,
  payload: documentRevision,
});

const loadList = (states: DocumentRevisionStatus[] = []): ApiAction<DocumentRevision[]> => {
  const url = states.length === 0
    ? DOCUMENT_REVISION_ROOT_URL
    : states.reduce((acc, state) => acc + `status%5B%5D=${state}&`, `${DOCUMENT_REVISION_ROOT_URL}?`);

  return apiAction({
    url,
    method: "get",
    asyncType: DOCUMENT_REVISION_LIST_ASYNC,
    onSuccess: (documentRevisions, dispatch) => {
      dispatch(documentRevisionsList(documentRevisions));
    },
  });
};

const load = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: "get",
  asyncType: DOCUMENT_REVISION_GET_ASYNC,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const save = (id: string, body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
  ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
    method: "patch",
    data: body,
    onSuccess: (documentRevision, dispatch) => {
      dispatch(documentRevisionSet(documentRevision));
    },
    handlers,
  });

const create = (body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
  ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
    url: DOCUMENT_REVISION_ROOT_URL,
    method: "post",
    data: body,
    onSuccess: (documentRevision, dispatch) => {
      documentsActions.setDocumentProposedId("");
      dispatch(documentRevisionSet(documentRevision));
    },
    onFailure: () => {
      const { docId } = body.document || { docId: "" };
      documentsActions.setDocumentProposedId(docId || "");
    },
    handlers,
  });

const documentSet = (document: Document): DocumentSetAction => ({
  type: DOCUMENT_SET,
  payload: document,
});

const loadDocument = (id: string): ApiAction<Document> => apiAction({
  url: `${DOCUMENT_ROOT_URL}/${id}`,
  method: "get",
  asyncType: DOCUMENT_GET_ASYNC,
  onSuccess: (document, dispatch) => {
    dispatch(documentSet(document));
  },
});

const applyTransition = (
  id: string,
  body: DocumentRevisionTransitionRequestBody,
  transition: DocumentRevisionTransition,
  handlers: Handlers<DocumentRevisionTransitionResponse>,
): ApiAction<DocumentRevisionTransitionResponse, DocumentRevisionTransitionRequestBody> => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/${transition}`,
  method: "post",
  data: body,
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
  },
  handlers,
});

const auditSet = (audit: AuditActionPayload): DocumentRevisionAuditSetAction => ({
  type: DOCUMENT_REVISION_AUDIT_SET,
  payload: audit,
});

const loadAudit = (id: string): ApiAction<Audit[]> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/audit`,
  method: "get",
  asyncType: DOCUMENT_REVISION_GET_AUDIT_ASYNC,
  onSuccess: (audit, dispatch) => {
    dispatch(auditSet({
      id,
      audit,
    }));
  },
});

const approveAndRelease = (
  id: string,
  body: Password,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release/${id}`,
  method: "post",
  data: body,
  password: body.password,
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
  },
  handlers,
});

export default {
  documentRevisionsList,
  documentRevisionSet,
  loadList,
  load,
  save,
  create,
  loadDocument,
  documentSet,
  applyTransition,
  auditSet,
  loadAudit,
  approveAndRelease,
};
