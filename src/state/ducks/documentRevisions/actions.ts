import { PasswordType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import axios from 'axios';
import { intl, translate } from '../../../common/intl';
import { toastError } from '../../../ui/components/notifications';
import { IWhereUsedRequest } from '../../../ui/components/whereUsed/WhereUsed.interface';
import { documentVersionPath } from '../../../ui/document.revision/utils/paths';
import { checkIsDocumentRecord } from '../../../ui/documentRevision/helpers/checkDocumentGroup';
import { CreateInspectionBody } from '../../../ui/documentRevision/InspectionControls/InspectionControls.types';
import { FBEndpoint } from '../../../ui/form.builder/defaults/FBEndpoint';
import { BOMResponse, IWhereUsedTree } from '../../../ui/form.builder/FBBOM/components/treelist/interface';
import { BOM } from '../../../ui/form.builder/FBBOM/interface';
import { Vendor } from '../../../ui/form.builder/FBPartVendors/types';
import FBDataStore from '../../../ui/form.builder/FBStore/FBDataStore';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { Audit, AuditActionPayload } from '../audit/types';
import { Group } from '../auth/types';
import { documentsActions } from '../documents';
import { MATERIAL_DISPOSITION_WHERE_USED_URL } from '../materialDisposition/constants';
import { ADD_ALTERNATE_PART, ADD_BOM_BRANCH, CHANGE_ORDER_BOM_BRANCH, CHECK_IS_USED, DELETE_ALTERNATE_PART, DELETE_BOM_BRANCH, DOCUMENT_GET_ASYNC, DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_FAI_INSPECTION_URL, DOCUMENT_REVISION_FORMS_URL, DOCUMENT_REVISION_GET_ASYNC, DOCUMENT_REVISION_GET_AUDIT_ASYNC, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_LIST_ASYNC, DOCUMENT_REVISION_PARTS_URL, DOCUMENT_REVISION_ROOT_URL, DOCUMENT_REVISION_SET, DOCUMENT_REVISION_UPGRADE_URL, DOCUMENT_ROOT_URL, DOCUMENT_SET, EQUIPMENT_ROOT_URL, FETCH_ALTERNATE_PART, FETCH_BOM_BRANCH, FETCH_BOM_TREE, FETCH_VENDORS, FETCH_WHERE_USED_TREE, LOT_OF_PARTS, LOT_ROOT_URL, PO_ROOT_URL, UPDATE_BOM_BRANCH } from './constants';
import { DocRevQueryParam, DocumentGroupOptionsType, DOC_TYPE_GROUP_OPTION } from './documentType/types';
import { ApproveAndReleaseRequest, CreateAndReleaseRequest, Document, DocumentRevision, DocumentRevisionAuditSetAction, DocumentRevisionEditRequestBody, DocumentRevisionSetAction, DocumentRevisionsListAction, DocumentRevisionStatus, DocumentRevisionTransition, DocumentRevisionTransitionRequestBody, DocumentRevisionTransitionResponse, DocumentSetAction, EquipmentStatus, ExportToEmailRequest, FBDocumentRevisionProps, FinalizeAndReleaseRequest, LotStatus, POStatusType, SecurityList, UpdateFormRequestBody } from './types';

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

const loadList = (
  states: DocumentRevisionStatus[] = [],
  queryParams: DocRevQueryParam,
): ApiAction<DocumentRevision[]> => {
  const url
    = states.length === 0
      ? DOCUMENT_REVISION_ROOT_URL
      : states.reduce((acc, state) => acc, `${DOCUMENT_REVISION_ROOT_URL}?`);
  return apiAction({
    url,
    params: queryParams,
    method: 'get',
    asyncType: DOCUMENT_REVISION_LIST_ASYNC,
    onSuccess: (documentRevisions, dispatch) => {
      dispatch(documentRevisionsList(documentRevisions));
    },
  });
};

const load = (id: string, asyncType = DOCUMENT_REVISION_GET_ASYNC): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: 'get',
  asyncType,
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
    method: 'get',
    handlers,
  });

// reload is same as load, but without async type
// when using load action the AsyncGate component will hide the document and show the spinner
// this is a silent load
const reload = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: 'get',
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const save = (id: string, body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>, helpers?: any):
ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: 'patch',
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
    helpers && helpers.resetForm();
    // dispatch(documentRevisionSet(undefined, body, id));
  },
  handlers,
  cancelToken: axios.CancelToken.source(),
  // temporarily disabling send-no-response header
  // should be uncommented later
  // sendNoResponseHeader: true,
});

const saveWithNoResponse = (id: string, body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: 'patch',
  data: body,
  handlers,
  cancelToken: axios.CancelToken.source(),
  sendNoResponseHeader: true,
});

const update = (id: string, body: FBDocumentRevisionProps): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}`,
  method: 'patch',
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const cancelPartEdit = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/cancel_edit/part/${id}`,
  method: 'patch',
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
  onFailure: (err) => {
    toastError(err as string);
  },
});

const ownerChange = (id: string, body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/owner_change`,
  method: 'patch',
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(loadAudit(id));
    dispatch(documentRevisionSet(documentRevision));
  },
  handlers,
  cancelToken: axios.CancelToken.source(),
});

const create = (body: DocumentRevisionEditRequestBody, handlers: Handlers<DocumentRevision>):
ApiAction<DocumentRevision, DocumentRevisionEditRequestBody> => apiActionWithCallbacks({
  url: DOCUMENT_REVISION_ROOT_URL,
  method: 'post',
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    documentsActions.setDocumentProposedId('');
    dispatch(documentRevisionSet(documentRevision));
  },
  onFailure: () => {
    const { docId } = body.document || { docId: '' };
    documentsActions.setDocumentProposedId(docId || '');
  },
  handlers,
});

const documentSet = (document: Document): DocumentSetAction => ({
  type: DOCUMENT_SET,
  payload: document,
});

const loadDocument = (id: string): ApiAction<Document> => apiAction({
  url: `${DOCUMENT_ROOT_URL}/${id}`,
  method: 'get',
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
  method: 'post',
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
  },
  handlers,
});

const approveAndReleaseNonQms = (
  id: string,
  body: any,
  password: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release_unsigned/${id}`,
  method: 'post',
  data: body,
  password,
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
  method: 'get',
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
  password,
  isSliderView,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release/${id}`,
  method: 'post',
  data: body,
  password,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    if (isSliderView) {
      FBDataStore.selectedSliderInfo = { documentId: docRev.document.id, documentRevision: docRev, reRender: true };
    } else {
      dispatch(load(id));
      dispatch(loadDocument(docRev.document.id));
    }
  },
  handlers,
});

const finalizeAndRelease = (
  id: string,
  body: FinalizeAndReleaseRequest,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release_without_ar/${id}`,
  method: 'post',
  data: body,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    if (checkIsDocumentRecord(docRev.document?.documentType?.groupOptions)) {
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
  method: 'post',
  data: body,
  password,
  onSuccess: (docRev: DocumentRevision, dispatch) => {
    dispatch(loadDocument(docRev.document.id));
  },
  handlers,
});

const updateAccess = (id: string, body: SecurityList, handlers: Handlers<Document>):
ApiAction<Document, SecurityList> => apiActionWithCallbacks({
  url: `${DOCUMENT_ROOT_URL}/${id}/update_security`,
  method: 'patch',
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentSet(documentRevision));
  },
  handlers,
});

const getRenderTemplatePreview = (
  id: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/renderTemplatePreview/${id}`,
  method: 'get',
  handlers,
});

const upgradeToReleasedForm = (
  id: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_UPGRADE_URL}/${id}`,
  method: 'patch',
  asyncType: DOCUMENT_REVISION_GET_ASYNC,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
  handlers,
});

const loadGroupsByStage = (id: string, handlers: Handlers): ApiAction<Group[]> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/required_approvers`,
    method: 'get',
    handlers,
  });

const cancelDraft = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/cancel/${id}`,
  method: 'patch',
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
});

const voidDocument = (id: string, body?: DocumentRevisionEditRequestBody): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/void/${id}`,
  method: 'patch',
  data: body,
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
  },
  onFailure: (error) => {
    toastError(error);
  },
});

const updatePO = (id: string, body: {poStatus: POStatusType}): ApiAction<DocumentRevision> => apiAction({
  url: `${PO_ROOT_URL}/${id}/status`,
  method: 'put',
  data: body,
  onSuccess: (response, dispatch) => {
    dispatch(load(id));
  },
  onFailure: () => {
    toastError(intl.formatMessage({ id: 'documentRevision.po.status.update.failed' }));
  },
});

const obsoletePO = (id: string, body: {poStatus: POStatusType}): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}${PO_ROOT_URL}/obsolete_void/${id}`,
  method: 'patch',
  data: body,
  onSuccess: (response, dispatch) => {
    dispatch(load(id));
  },
  onFailure: () => {
    toastError(intl.formatMessage({ id: 'documentRevision.po.status.update.failed' }));
  },
});

const setPrimaryAttachment = (
  docRevId: string,
  attachmentId: string,
  handlers: Handlers,
): ApiAction<DocumentRevision> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${docRevId}/set_primary/${attachmentId}`,
    method: 'patch',
    onSuccess: (documentRevision, dispatch) => {
      dispatch(documentRevisionSet(documentRevision));
    },
    handlers,
  });

const cloneDoc = (id: string, payload: PasswordType, handlers: Handlers): ApiAction<DocumentRevision> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/copy/${id}`,
    method: 'post',
    data: payload,
    handlers,
  });

const getDocRevStatuses = (
  handlers: Handlers,
  states: DocumentRevisionStatus[] = [],
  notGroupOptions?: DocumentGroupOptionsType[],
  category?: string,
  notIncategory?: string,
): ApiAction<Partial<DocumentRevisionStatus[]>> => {
  const categoryUrl = category === undefined
    ? states.reduce((acc, state) => acc + `status%5B%5D=${state}&`,
      `${DOCUMENT_REVISION_ROOT_URL}/statuses?`)
    : states.reduce((acc, state) => acc + `status%5B%5D=${state}&`,
      `${DOCUMENT_REVISION_ROOT_URL}/statuses?category=${category}&`);
  const notInGroupcheckURL = notGroupOptions && notGroupOptions?.length !== 0
    ? notGroupOptions.reduce((acc, groupOption) => acc + `notGroupOptions%5B%5D=${groupOption}&`,
      `${categoryUrl}`) : categoryUrl;
  const url = notIncategory === undefined
    ? notInGroupcheckURL : `${notInGroupcheckURL}notIncategory=${notIncategory}&`;
  return apiActionWithCallbacks({
    url,
    method: 'get',
    handlers,
  });
};

const fetchAvailableForms = (
  docTypeGroupOption: DOC_TYPE_GROUP_OPTION,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: DOCUMENT_REVISION_FORMS_URL,
    params: {
      docTypeGroupOption,
    },
    method: 'get',
    handlers,
  });

const fetchAvailableParts = (
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: DOCUMENT_REVISION_PARTS_URL,
    method: 'get',
    handlers,
  });

const fetchLotsByPartId = (
  partId: string,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${LOT_OF_PARTS}/${partId}`,
    method: 'get',
    handlers,
  });

const fetchAvailableLHRList = (
  partRevIdSelected: string,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${FBEndpoint.FetchAvailableLhrForPart}/${partRevIdSelected}`,
    method: 'get',
    handlers,
  });

const fetchSelectedLHR = (
  lhrRevIds: string[],
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${FBEndpoint.FetchLhrDetails}?lhrRevIds=${lhrRevIds.join(',')}`,
    method: 'get',
    handlers,
  });

const fetchBOMBranch = (
  docRevId,
  docId,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_BOM_BRANCH}/${docId}/${docRevId}`,
    method: 'get',
    handlers,
  });

const fetchBOMTree = (
  docRevId,
  isFirstLevelOnly = false,
  handlers: Handlers,
): ApiAction<BOMResponse> =>
  apiActionWithCallbacks({
    url: `${FETCH_BOM_TREE}/${docRevId}?isFirstLevelOnly=${isFirstLevelOnly}`,
    method: 'get',
    handlers,
  });

const fetchWhereUsedTree = (
  docRevId,
  handlers: Handlers,
): ApiAction<IWhereUsedTree[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_WHERE_USED_TREE}/${docRevId}`,
    method: 'get',
    handlers,
  });

const fetchHasATree = (
  docRevIds,
  handlers: Handlers,
): ApiAction<BOM[] | undefined> =>
  apiActionWithCallbacks({
    url: `${CHECK_IS_USED}`,
    method: 'post',
    data: {
      ids: docRevIds,
    },
    handlers,
  });

const addBOMBranch = (
  data,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${ADD_BOM_BRANCH}`,
    method: 'post',
    data,
    handlers,
  });

const updateBOMBranch = (
  parentNodeRevId,
  childNodeRevId,
  data,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${UPDATE_BOM_BRANCH}/${parentNodeRevId}`,
    method: 'patch',
    data: { ...data, childNodeRevId },
    handlers,
  });

const alternatePartRevUpdate = (
  data,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_ALTERNATE_PART}`,
    method: 'patch',
    data,
    handlers,
  });

const changeOrderBOMBranch = (
  parentNodeRevId,
  data,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${CHANGE_ORDER_BOM_BRANCH}/${parentNodeRevId}`,
    method: 'post',
    data,
    handlers,
  });

const deleteBOMBranch = (
  parentNodeRevId,
  childNodeRevId,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${DELETE_BOM_BRANCH}/${parentNodeRevId}/${childNodeRevId}`,
    method: 'delete',
    handlers,
  });

const fetchVendors = (
  parentNodeRevId,
  handlers: Handlers,
): ApiAction<Vendor[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_VENDORS}/${parentNodeRevId}`,
    method: 'get',
    handlers,
  });

const fetchAlternateParts = (
  basePartRevId: string,
  partRevId: string,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_ALTERNATE_PART}/${basePartRevId}/${partRevId}`,
    method: 'get',
    handlers,
  });

const addAlternatePart = (
  data,
  handlers: Handlers,
): ApiAction<BOM[]> =>
  apiActionWithCallbacks({
    url: `${ADD_ALTERNATE_PART}`,
    method: 'post',
    data,
    handlers,
  });

const deleteAlternatePart = (
  partRevId: string,
  alternatePartRevId: string,
  basePartRevId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${DELETE_ALTERNATE_PART}/${basePartRevId}/${partRevId}/${alternatePartRevId}`,
    method: 'delete',
    handlers,
  });

const createFaiInspection = (
  data: CreateInspectionBody,
  handlers: Handlers,
): ApiAction<DocumentRevision> =>
  apiActionWithCallbacks({
    url: DOCUMENT_REVISION_FAI_INSPECTION_URL,
    method: 'post',
    data,
    handlers,
  });

const removePreviousBuild = (
  id: string,
  handlers: Handlers,
): ApiAction<DocumentRevision> =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/parent_remove`,
    method: 'post',
    onSuccess: (documentRevision, dispatch) => {
      dispatch(documentRevisionSet(documentRevision));
    },
    handlers,
  });

const exportToEmail = (
  revisionId: string,
  body: ExportToEmailRequest,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/export/revision/${revisionId}/email`,
    method: 'post',
    data: body,
    handlers,
  });

const updateForm = (
  id: string,
  body: UpdateFormRequestBody,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/update_form`,
  method: 'post',
  data: body,
  handlers,
});

const getFormMappingTemplate = (
  sourceFormId: string,
  targetFormId: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `/form_mapping/${sourceFormId}/${targetFormId}`,
  method: 'get',
  handlers,
});

const updateLotStatus = (id: string, body: { lotStatus: LotStatus }): ApiAction<DocumentRevision> => apiAction({
  url: `${LOT_ROOT_URL}/${id}/status`,
  method: 'put',
  data: body,
  onSuccess: (response, dispatch) => {
    dispatch(load(id));
  },
  onFailure: () => {
    toastError(translate('documentRevision.lot.status.update.failed'));
  },
});

const updateEquipmentStatus = (id: string, body: { EquipmentStatus: EquipmentStatus }): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}${EQUIPMENT_ROOT_URL}/${id}`,
  method: 'patch',
  data: body,
  onSuccess: (response, dispatch) => {
    dispatch(load(id));
  },
  onFailure: () => {
    toastError(translate('documentRevision.equipment.status.update.failed'));
  },
});

const fetchWhereUsedLotTree = (
  body: IWhereUsedRequest,
  handlers: Handlers,
): ApiAction<IWhereUsedTree[]> =>
  apiActionWithCallbacks({
    url: MATERIAL_DISPOSITION_WHERE_USED_URL,
    method: 'post',
    data: body,
    handlers,
  });

const getAllApprovalRequests = (
  id: string,
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/${id}/all_approval_requests`,
  method: 'get',
  handlers,
});

export default {
  documentRevisionsList,
  documentRevisionSet,
  loadList,
  load,
  loadWithCallback,
  save,
  update,
  cancelPartEdit,
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
  updatePO,
  obsoletePO,
  cloneDoc,
  finalizeAndRelease,
  getDocRevStatuses,
  fetchAvailableForms,
  createFaiInspection,
  removePreviousBuild,
  ownerChange,
  saveWithNoResponse,
  exportToEmail,
  updateForm,
  getFormMappingTemplate,
  fetchAvailableParts,
  fetchAvailableLHRList,
  fetchLotsByPartId,
  fetchSelectedLHR,
  fetchBOMBranch,
  fetchBOMTree,
  addBOMBranch,
  fetchAlternateParts,
  addAlternatePart,
  fetchVendors,
  deleteAlternatePart,
  deleteBOMBranch,
  updateBOMBranch,
  changeOrderBOMBranch,
  fetchWhereUsedTree,
  fetchHasATree,
  fetchWhereUsedLotTree,
  alternatePartRevUpdate,
  updateLotStatus,
  getAllApprovalRequests,
  updateEquipmentStatus,
};
