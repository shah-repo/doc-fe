import axios from "axios";
import { documentVersionPath } from "../../../ui/document.revision/utils/paths";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { Audit, AuditActionPayload } from "../audit/types";
import { Group } from "../auth/types";
import { documentsActions } from "../documents";
import { DOCUMENT_GET_ASYNC, DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_GET_ASYNC, DOCUMENT_REVISION_GET_AUDIT_ASYNC, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_LIST_ASYNC, DOCUMENT_REVISION_ROOT_URL, DOCUMENT_REVISION_SET, DOCUMENT_REVISION_UPGRADE_URL, DOCUMENT_ROOT_URL, DOCUMENT_SET } from "./constants";
import { DocumentGroupOptionsType } from "./documentType";
import { ApproveAndReleaseRequest, CreateAndReleaseRequest, Document, DocumentRevision, DocumentRevisionAuditSetAction, DocumentRevisionEditRequestBody, DocumentRevisionSetAction, DocumentRevisionsListAction, DocumentRevisionStatus, DocumentRevisionTransition, DocumentRevisionTransitionRequestBody, DocumentRevisionTransitionResponse, DocumentSetAction, FinalizeAndReleaseRequest, SecurityList } from "./types";

const documentRevisionsList = (documentRevisions: DocumentRevision[]): DocumentRevisionsListAction => ({
  type: DOCUMENT_REVISION_LIST,
  payload: documentRevisions,
});

const documentRevisionSet = (
  documentRevision?: DocumentRevision,
  requestBody?: any,
  docRevId?: string): DocumentRevisionSetAction => ({
  type: DOCUMENT_REVISION_SET,
  payload: { documentRevision, requestBody, docRevId },
});

const loadList = (states: DocumentRevisionStatus[] = []): ApiAction<DocumentRevision[]> => {
  const url = states.length === 0
    ? DOCUMENT_REVISION_ROOT_URL
    : states.reduce((acc, state) => acc, `${DOCUMENT_REVISION_ROOT_URL}?`);
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

const loadWithCallback = (
  id: string,
  handlers: Handlers<DocumentRevision>,
): ApiAction<DocumentRevision> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
    method: "get",
    handlers,
  });

// reload is same as load, but without async type
// when using load action the AsyncGate component will hide the document and show the spinner
// this is a silent load
const reload = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: "get",
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
    dispatch(loadAudit(id));
    dispatch(documentRevisionSet(documentRevision));
    // dispatch(documentRevisionSet(undefined, body, id));
  },
  handlers,
  cancelToken: axios.CancelToken.source(),
  // temporarily disabling send-no-response header
  // should be uncommented later
  // sendNoResponseHeader: true,
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
  transition: DocumentRevisionTransition,
  handlers: Handlers<DocumentRevisionTransitionResponse>,
): ApiAction<DocumentRevisionTransitionResponse, DocumentRevisionTransitionRequestBody> => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${transition}/${id}`,
  method: "post",
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
  },
  handlers,
});

const approveAndReleaseNonQms = (
  id: string,
  body: any,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release/release_non_qms/${id}`,
  method: "post",
  data: body,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    dispatch(load(id));
    dispatch(loadDocument(docRev.document.id));
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
  body: ApproveAndReleaseRequest,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release/${id}`,
  method: "post",
  data: body,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    dispatch(load(id));
    dispatch(loadDocument(docRev.document.id));
  },
  handlers,
});

const finalizeAndRelease = (
  id: string,
  body: FinalizeAndReleaseRequest,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release_without_ar/${id}`,
  method: "post",
  data: body,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    if (docRev.document?.documentType?.group === "RECORD") {
      window.location.href = documentVersionPath(docRev.id, docRev.document.id);
    } else {
      dispatch(load(id));
      dispatch(loadDocument(docRev.document.id));
    }
  },
  handlers,
});

const createAndRelease = (
  body: CreateAndReleaseRequest,
  password: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/create_and_release`,
  method: "post",
  data: body,
  password,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    dispatch(loadDocument(docRev.document.id));
  },
  handlers,
});

const updateAccess = (id: string, body: SecurityList, handlers: Handlers<DocumentRevision>):
ApiAction<DocumentRevision, SecurityList> => apiActionWithCallbacks({
  url: `${DOCUMENT_ROOT_URL}/${id}/update_security`,
  method: "patch",
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
  handlers,
});

const getRenderTemplatePreview = (
  id: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/renderTemplatePreview/${id}`,
  method: "get",
  handlers,
});

const upgradeToReleasedForm = (
  id: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_UPGRADE_URL}/${id}`,
  method: "patch",
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
  handlers,
});

const loadGroupsByStage = (id: string, handlers: Handlers): ApiAction<Group[]> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/required_approvers`,
    method: "get",
    handlers,
  });

const cancelDraft = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/cancel/${id}`,
  method: "patch",
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const voidDocument = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/void/${id}`,
  method: "patch",
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const setPrimaryAttachment = (
  docRevId: string,
  attachmentId: string,
  handlers: Handlers
): ApiAction<DocumentRevision> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${docRevId}/set_primary/${attachmentId}`,
    method: "patch",
    onSuccess: (documentRevision, dispatch) => {
      dispatch(documentRevisionSet(documentRevision));
    },
    handlers,
  });

const cloneEB = (id: string, handlers: Handlers): ApiAction<DocumentRevision> => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/copy/${id}`,
  method: "post",
  handlers,
});

const getDocRevStatuses = (
  handlers: Handlers,
  states: DocumentRevisionStatus[] = [],
  notGroupOptions?: DocumentGroupOptionsType[],
  category?: string,
): ApiAction<Partial<DocumentRevisionStatus[]>> => {
  const categoryUrl = category === undefined ?
    states.reduce((acc, state) =>  acc + `status%5B%5D=${state}&`,
      `${DOCUMENT_REVISION_ROOT_URL}/statuses?`) :
    states.reduce((acc, state) => acc + `status%5B%5D=${state}&`,
      `${DOCUMENT_REVISION_ROOT_URL}/statuses?category=${category}&`);
  const url = notGroupOptions && notGroupOptions?.length !== 0 ?
    notGroupOptions.reduce((acc, groupOption) =>  acc + `notGroupOptions%5B%5D=${groupOption}&`,
      `${categoryUrl}`) : categoryUrl;
  return apiActionWithCallbacks({
    url,
    method: "get",
    handlers,
  });
};

export default {
  documentRevisionsList,
  documentRevisionSet,
  loadList,
  load,
  loadWithCallback,
  save,
  create,
  loadDocument,
  documentSet,
  applyTransition,
  auditSet,
  loadAudit,
  approveAndRelease,
  updateAccess,
  approveAndReleaseNonQms,
  getRenderTemplatePreview,
  upgradeToReleasedForm,
  createAndRelease,
  loadGroupsByStage,
  cancelDraft,
  reload,
  setPrimaryAttachment,
  voidDocument,
  cloneEB,
  finalizeAndRelease,
  getDocRevStatuses,
};
