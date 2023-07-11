import { PasswordType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import axios from 'axios';
import { intl } from '../../../common/intl';
import { toastError } from '../../../ui/components/notifications';
import { documentVersionPath } from '../../../ui/document.revision/utils/paths';
import { checkIsDocumentRecord } from '../../../ui/documentRevision/helpers/checkDocumentGroup';
import { CreateInspectionBody } from '../../../ui/documentRevision/InspectionControls/InspectionControls.types';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { Audit, AuditActionPayload } from '../audit/types';
import { Group } from '../auth/types';
import { documentsActions } from '../documents';
import { DOCUMENT_GET_ASYNC, DOCUMENT_REVISION_AUDIT_SET, DOCUMENT_REVISION_FAI_INSPECTION_URL, DOCUMENT_REVISION_FORMS_URL, DOCUMENT_REVISION_GET_ASYNC, DOCUMENT_REVISION_GET_AUDIT_ASYNC, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_LIST_ASYNC, DOCUMENT_REVISION_PARTS_URL, DOCUMENT_REVISION_ROOT_URL, DOCUMENT_REVISION_SET, DOCUMENT_REVISION_UPGRADE_URL, DOCUMENT_ROOT_URL, DOCUMENT_SET, PO_ROOT_URL } from './constants';
import { DocRevQueryParam, DocumentGroupOptionsType, DOC_TYPE_GROUP_OPTION } from './documentType/types';
import { ApproveAndReleaseRequest, CreateAndReleaseRequest, Document, DocumentRevision, DocumentRevisionAuditSetAction, DocumentRevisionEditRequestBody, DocumentRevisionSetAction, DocumentRevisionsListAction, DocumentRevisionStatus, DocumentRevisionTransition, DocumentRevisionTransitionRequestBody, DocumentRevisionTransitionResponse, DocumentSetAction, ExportToEmailRequest, FBDocumentRevisionProps, FinalizeAndReleaseRequest, POStatusType, SecurityList, UpdateFormRequestBody } from './types';

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

const load = (id: string, asyncType = DOCUMENT_REVISION_GET_ASYNC ): ApiAction<DocumentRevision> => apiAction({
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
    const testing = test2 as AuditActionPayload;
    audit = testing;
    console.log('----audit-dispatch----', { audit, testing, test2 });
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
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_ROOT_URL}/release/${id}`,
  method: 'post',
  data: body,
  password,
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

const voidDocument = (id: string): ApiAction<DocumentRevision> => apiAction({
  url: `${DOCUMENT_REVISION_ROOT_URL}/void/${id}`,
  method: 'patch',
  onSuccess: (documentRevision, dispatch) => {
    dispatch(documentRevisionSet(documentRevision));
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
    ? states.reduce((acc, state) =>  acc + `status%5B%5D=${state}&`,
      `${DOCUMENT_REVISION_ROOT_URL}/statuses?`)
    : states.reduce((acc, state) => acc + `status%5B%5D=${state}&`,
      `${DOCUMENT_REVISION_ROOT_URL}/statuses?category=${category}&`);
  const notInGroupcheckURL = notGroupOptions && notGroupOptions?.length !== 0
    ? notGroupOptions.reduce((acc, groupOption) =>  acc + `notGroupOptions%5B%5D=${groupOption}&`,
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

export default {
  documentRevisionsList,
  documentRevisionSet,
  loadList,
  load,
  loadWithCallback,
  save,
  update,
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
};


const test = [
  {
      id: 'd4388745-18c9-41b7-92f2-96264ec952b6',
      field: 'suffixName',
      type: 'ARRAY_EDITED',
      nextValue: 'World India',
      previousValue: 'hello World India',
      hasPoReceivedQtyFlag: false,
      timestamp: '2023-07-06T07:04:05.258Z',
      owner: {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      ownerId: '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      ownerUserId: null,
      groupId: 'c6f89377-8cc2-4e96-8ba9-7251c869acc2',
      isRelation: false,
      ownerEmail: 'sgore@enlil.com',
      ownerName: 'Sandeep Gore',
      documentRevisionId: 'c7c8584b-e705-490e-acce-886f016496f8',
      docId: 'PRT-03903'
  },
  {
    id: 'd4388745-18c9-41b7-92f2-96264ec952b6',
    field: 'suffixNumber',
    type: 'ARRAY_EDITED',
    nextValue: '123',
    previousValue: '123',
    hasPoReceivedQtyFlag: false,
    timestamp: '2023-07-06T07:04:05.258Z',
    owner: {
        'createdAt': '2022-07-27T10:14:09.006Z',
        'updatedAt': '2022-07-27T10:14:09.006Z',
        'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
        'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
        'active': true,
        'slackUserId': null,
        'user': {
            'createdAt': '2022-07-27T10:14:09.006Z',
            'updatedAt': '2023-05-29T08:02:23.778Z',
            'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
            'email': 'sgore@enlil.com',
            'name': 'Sandeep Gore',
            'confirmed': true,
            'locked': false,
            'passwordExpires': true,
            'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
            'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
            'permissions': null,
            'avatar': null,
            'initialColor': '#e285ca',
            'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
            'resendConfirmationEmailTimestamp': null,
            'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
            'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
        }
    },
    ownerId: '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
    ownerUserId: null,
    groupId: 'c6f89377-8cc2-4e96-8ba9-7251c869acc2',
    isRelation: false,
    ownerEmail: 'sgore@enlil.com',
    ownerName: 'Sandeep Gore',
    documentRevisionId: 'c7c8584b-e705-490e-acce-886f016496f8',
    docId: 'PRT-03903'
},
  {
      id: '7a324d29-fffd-4db0-85ba-9467e81d3766',
      field: 'subParts',
      type: 'ARRAY_NEW',
      nextValue: 'PRT-03903-567 hoshi',
      previousValue: null,
      hasPoReceivedQtyFlag: false,
      timestamp: '2023-07-06T06:08:19.005Z',
      owner: {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      ownerId: '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      ownerUserId: null,
      groupId: 'ab7923a4-3d39-493a-b9d6-e950d124a45a',
      isRelation: false,
      ownerEmail: 'sgore@enlil.com',
      ownerName: 'Sandeep Gore',
      documentRevisionId: 'c7c8584b-e705-490e-acce-886f016496f8',
      docId: 'PRT-03903'
  },
  {
      'id': 'e1c44d01-f7b6-426a-a6c2-b4f8f7d399b6',
      'field': 'subParts',
      'type': 'ARRAY_NEW',
      'nextValue': 'PRT-03903-123',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:52:02.897Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'd6bac611-2b6e-48c9-bc5e-d9efcc980735',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '33232ae6-452e-407e-b72c-beebcc066ba6',
      'field': 'relatedPartsStatus',
      'type': 'STRING_NEW',
      'nextValue': 'parent_together',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:40.650Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'f0e4140f-22ca-44bc-b982-e6d4e795c4fd',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '35c3a60c-f352-45be-b644-404a2a4a88d8',
      'field': 'document.docId',
      'type': 'STRING_NEW',
      'nextValue': 'PRT-03903',
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': null,
      'docId': 'EFM-00502'
  },
  {
      'id': '4779a26c-8f83-44b0-86b3-d7d42704a400',
      'field': 'securityGroups',
      'type': 'ARRAY_NEW',
      'nextValue': {
          'createdAt': '2020-02-18T12:32:51.085Z',
          'updatedAt': '2023-04-10T06:00:45.576Z',
          'id': 'b63e2c6b-bac5-4805-bcff-955e49fa0131',
          'name': 'Everyone',
          'permissions': [
              'EMPLOYEE_GET',
              'CR_ON_APPROVER_LIST',
              'CR_OWNER_AS_APPROVER'
          ],
          'defaultForNewUsers': true,
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'tags': [
              'QMS_DEFAULT',
              'OWNERSHIP_CHANGE',
              'FB_COMPONENT_INLINE_APPROVAL'
          ],
          'type': 'MANAGMENT',
          'isOfficial': true
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  },
  {
      'id': '477dba78-4f22-4b41-a363-6d7445da8a67',
      'field': 'securityGroups',
      'type': 'ARRAY_NEW',
      'nextValue': {
          'createdAt': '2022-07-07T07:25:47.123Z',
          'updatedAt': '2023-04-10T05:56:03.745Z',
          'id': 'dc78814d-a7ad-4a4a-8298-d45c9ef9c95a',
          'name': 'Product Team',
          'permissions': [
              'COMPANY_BOOTSTRAP',
              'COMPANY_CREATE',
              'COMPANY_DELETE',
              'COMPANY_GET',
              'COMPANY_UPDATE',
              'COMPANY_UPDATE_CURRENT',
              'CR_OWNER_AS_APPROVER',
              'CR_ON_APPROVER_LIST',
              'EMPLOYEE_CREATE',
              'EMPLOYEE_DELETE',
              'EMPLOYEE_GET',
              'EMPLOYEE_UPDATE',
              'EMPLOYEE_ADMIN_CREATE',
              'EMPLOYEE_ADMIN_DELETE',
              'EMPLOYEE_ADMIN_UPDATE',
              'EMPLOYEE_ADMIN_GET',
              'GROUP_CREATE',
              'GROUP_DELETE',
              'GROUP_UPDATE',
              'GROUP_GET',
              'GROUP_CREATE_UNOFFICIAL',
              'GROUP_UPDATE_UNOFFICIAL',
              'USERS_CREATE',
              'USERS_GET',
              'USERS_UPDATE',
              'REMOTE_VALIDATORS_REFRESH',
              'SLACK_APP_INSTALL',
              'DEVELOPERS',
              'DOC_REV_OBS_TO_RELEASED',
              'DOCUMENT_OWNER_CHANGE',
              'HTML_UPDATE',
              'SEND_PASSWORD_RESET_EMAIL',
              'DUE_TRAININGS',
              'ASYNC_TASKS_UI'
          ],
          'defaultForNewUsers': false,
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'tags': [
              'USER_MANAGEMENT',
              'GROUP_MANAGEMENT',
              'OWNERSHIP_CHANGE',
              'QMS_DEFAULT',
              'FB_COMPONENT_PURCHASE_ORDER',
              'FB_COMPONENT_RECEIVE_PURCHASE_ORDER',
              'FB_COMPONENT_INLINE_APPROVAL',
              'FB_COMPONENT_REQUEST_APPROVAL',
              'NAVIGATION_WITH_RESTRICTED_DOC_TYPES',
              'CREATE_DOCS_OF_RESTRICTED_DOC_TYPES',
              'DOCUMENT_TYPE_MANAGEMENT',
              'FB_COMPONENT_EQUIPMENT_MAINTENANCE',
              'LABEL_TOOLTIPS',
              'COMPANY_CONFIG_WHITELABELING',
              'COMPANY_CONFIG_NAVIGATION',
              'COMPANY_CONFIG_DOCUMENT_REV_STAGES',
              'PAGE_DETAILS_MANAGEMENT',
              'DASHBOARD_ADMIN',
              'ASYNC_TASKS_UI'
          ],
          'type': 'MANAGMENT',
          'isOfficial': true
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  },
  {
      'id': '07f9d51a-ac3a-4f02-841d-7be322555468',
      'field': 'displayStatus',
      'type': 'STRING_NEW',
      'nextValue': 'Draft',
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'f0f04826-335a-42fb-b3dc-1626f4d11eb8',
      'field': 'owner',
      'type': 'STRING_NEW',
      'nextValue': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  },
  {
      'id': 'e9b107eb-0adb-482e-8957-d97bece711e2',
      'field': 'formDocument',
      'type': 'STRING_NEW',
      'nextValue': {
          'createdAt': '2022-07-21T06:25:43.953Z',
          'updatedAt': '2022-07-21T06:25:57.302Z',
          'id': '990798f6-5e70-43fb-aa39-f23e46b7ef3d',
          'version': 1,
          'revision': 1,
          'subRevision': 0,
          'revisionStage': 1,
          'displayRevision': '1',
          'description': '<p>fvf</p>',
          'name': 'part',
          'status': 'RELEASED',
          'poStatus': 'OPENED',
          'displayStatus': 'Released',
          'deprecatedAt': null,
          'effectiveDate': '2022-07-20T07:00:00.000Z',
          'approvedAt': '2022-07-21T06:25:58.186Z',
          'releasedAt': '2022-07-21T06:25:58.450Z',
          'obsoletedAt': null,
          'voidedAt': null,
          'retrain': false,
          'redline': false,
          'formInput': null,
          'inputOwners': {},
          'downloadAllAttachmentsZipS3Link': null,
          'lastZipFileUpdate': null,
          'documentId': '514f6a35-aeba-4ea6-88c2-70d444769971',
          'changeRequestId': '453bcc59-f7e6-4af9-93c6-6b953ad3193e',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'revisionChangeType': 'NEXT_REVISION',
          'schema': null,
          'formDocumentId': null,
          'externalId': null,
          'renderHTMLDefined': false,
          'usedDocumentsInLHRS': null,
          'precalc': null,
          'document': {
              'createdAt': '2022-07-21T06:25:43.953Z',
              'updatedAt': '2022-07-21T06:25:43.953Z',
              'id': '514f6a35-aeba-4ea6-88c2-70d444769971',
              'docId': 'FM-03117',
              'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
              'massCreateExecuted': null,
              'typeSpecificConfig': null
          },
          'owner': {
              'createdAt': '2022-02-28T07:02:00.569Z',
              'updatedAt': '2022-07-07T07:25:47.123Z',
              'id': 'b4cddb73-5b89-49d4-93cb-55d409de6192',
              'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
              'active': true,
              'slackUserId': null,
              'user': {
                  'createdAt': '2022-02-28T07:02:00.569Z',
                  'updatedAt': '2023-01-16T07:40:28.755Z',
                  'id': 'e424710f-b9c1-4669-9135-55cdabc63df6',
                  'email': 'dsharma@enlil.com',
                  'name': 'Divya Sharma',
                  'confirmed': true,
                  'locked': true,
                  'passwordExpires': true,
                  'passwordLastEmailSentAt': '2023-01-02T08:00:00.000Z',
                  'passwordUpdatedAt': '2022-10-04T09:19:57.522Z',
                  'permissions': null,
                  'avatar': 'https://doc-be-dev-public.s3.us-west-2.amazonaws.com/cdce82eb-bf68-481e-af5f-f9c16853d7c0/2022-07-20T08%3A40%3A47.751Z/pexels-icon.jpeg',
                  'initialColor': '#fcfa97',
                  'resetPasswordEmailTimestamp': '2022-10-04T09:17:44.381Z',
                  'resendConfirmationEmailTimestamp': null,
                  'forgotPasswordEmailTimestamp': null,
                  'passwordSetTimestamp': '2022-10-04T09:19:57.738Z'
              }
          }
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  }
];

const test2 = [
  {
      'id': '61efb32f-b479-46f8-a74e-b62f93eb2e2b',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': 'new part',
      'previousValue': 'new ',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-10T06:21:04.994Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'b88f1b06-b00e-4ecb-8062-49b750e2f99c',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '3576f1f1-d4ac-4aca-b388-89c3d42b7ff2',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '567',
      'previousValue': '5678',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-10T06:21:04.708Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'b88f1b06-b00e-4ecb-8062-49b750e2f99c',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'd99a5de2-381b-4c3b-9b9d-019db47681e7',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': 'new previous value',
      'previousValue': 'new previous value',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-10T06:18:14.067Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '337461c9-f5e9-4fc6-9308-74464a6a5a3a',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'b4dd3693-cf72-4ae7-8ba1-9f1cb21d9591',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '567',
      'previousValue': '567',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-10T06:18:13.760Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '337461c9-f5e9-4fc6-9308-74464a6a5a3a',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '21cab072-763e-4601-9892-27caaf155939',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'suffixNumber\':\'567\',\'suffixName\':\'new previous value\'}',
      'previousValue': '{\'suffixNumber\':\'567\',\'suffixName\':\'new and previous value\'}',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T07:37:32.640Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '832f6f2d-dd6e-4506-8c97-47a7bdf031c1',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'd4388745-18c9-41b7-92f2-96264ec952b6',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'suffixNumber\':\'123\',\'suffixName\':\' World India\'}',
      'previousValue': '{\'suffixNumber\':\'123\',\'suffixName\':\'hello World India\'}',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T07:04:05.258Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'c6f89377-8cc2-4e96-8ba9-7251c869acc2',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'd8c83693-d40f-4b6c-8b1d-0e6cf259cded',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'docId\':\'567\',\'title\':\'new and previous value\'}',
      'previousValue': '{\'docId\':\'567\',\'title\':\'new value changed\'}',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:56:07.232Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '24ad3a76-a618-4fee-9522-a2322f492cd5',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '7e8957e8-d489-4b03-baa3-a6f1cfc2999d',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'createdAt\':\'2023-07-06T05:52:02.912Z\',\'updatedAt\':\'2023-07-06T06:41:16.332Z\',\'id\':\'16c6e3bf-76f3-435a-9497-5a3c93938868\',\'documentId\':\'62d211cb-ba96-4ad4-bfb7-d9eb5368161a\',\'documentRevisionId\':\'f74a7f82-bb19-4567-950e-44f6e39115d0\',\'rootDocId\':\'PRT-03903-123\',\'suffixNumber\':\'123\',\'suffixName\':\'hello World India\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'previousValue': '{\'createdAt\':\'2023-07-06T05:52:02.912Z\',\'updatedAt\':\'2023-07-06T06:41:16.332Z\',\'id\':\'16c6e3bf-76f3-435a-9497-5a3c93938868\',\'documentId\':\'62d211cb-ba96-4ad4-bfb7-d9eb5368161a\',\'documentRevisionId\':\'f74a7f82-bb19-4567-950e-44f6e39115d0\',\'rootDocId\':\'PRT-03903-123\',\'suffixNumber\':\'123\',\'suffixName\':\'hello World\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:52:17.302Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'b0a34e8c-b532-4c14-8563-adf2126d171f',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'e59a7880-b24a-4aa3-bac4-9d3b13b54a6b',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'createdAt\':\'2023-07-06T06:08:21.802Z\',\'updatedAt\':\'2023-07-06T06:43:33.804Z\',\'id\':\'94351903-22f5-40e7-82f2-1ae809d4b1c3\',\'documentId\':\'a8394af6-e374-414b-947b-00ff1f359b98\',\'documentRevisionId\':\'1ffb0526-c330-4a48-868f-718d791ec6d9\',\'rootDocId\':\'PRT-03903-567\',\'suffixNumber\':\'567\',\'suffixName\':\'new value changed\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'previousValue': '{\'createdAt\':\'2023-07-06T06:08:21.802Z\',\'updatedAt\':\'2023-07-06T06:43:33.804Z\',\'id\':\'94351903-22f5-40e7-82f2-1ae809d4b1c3\',\'documentId\':\'a8394af6-e374-414b-947b-00ff1f359b98\',\'documentRevisionId\':\'1ffb0526-c330-4a48-868f-718d791ec6d9\',\'rootDocId\':\'PRT-03903-567\',\'suffixNumber\':\'567\',\'suffixName\':\'new value changed\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:50:28.107Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '8a4165bb-7148-4090-91f8-7fbec9d0051c',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'f08d7a83-a854-4281-a256-3137e7af3235',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'createdAt\':\'2023-07-06T06:08:21.802Z\',\'updatedAt\':\'2023-07-06T06:19:20.038Z\',\'id\':\'94351903-22f5-40e7-82f2-1ae809d4b1c3\',\'documentId\':\'a8394af6-e374-414b-947b-00ff1f359b98\',\'documentRevisionId\':\'1ffb0526-c330-4a48-868f-718d791ec6d9\',\'rootDocId\':\'PRT-03903-567\',\'suffixNumber\':\'567\',\'suffixName\':\'new value\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:43:33.021Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '8aecde51-f1c0-43f9-a07a-616739ec9613',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'fc4b4073-3406-46e3-ae1b-a24924b13a17',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'createdAt\':\'2023-07-06T05:52:02.912Z\',\'updatedAt\':\'2023-07-06T06:32:30.159Z\',\'id\':\'16c6e3bf-76f3-435a-9497-5a3c93938868\',\'documentId\':\'62d211cb-ba96-4ad4-bfb7-d9eb5368161a\',\'documentRevisionId\':\'f74a7f82-bb19-4567-950e-44f6e39115d0\',\'rootDocId\':\'PRT-03903-123\',\'suffixNumber\':\'123\',\'suffixName\':\'hello World\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:41:15.548Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '44632cb0-ce6b-46e0-a14c-92c0f14b004f',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '36b3fa0f-6e1c-440a-ba51-7086b7974378',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'createdAt\':\'2023-07-06T05:52:02.912Z\',\'updatedAt\':\'2023-07-06T06:05:34.074Z\',\'id\':\'16c6e3bf-76f3-435a-9497-5a3c93938868\',\'documentId\':\'62d211cb-ba96-4ad4-bfb7-d9eb5368161a\',\'documentRevisionId\':\'f74a7f82-bb19-4567-950e-44f6e39115d0\',\'rootDocId\':\'PRT-03903-123\',\'suffixNumber\':\'123\',\'suffixName\':\'hello \',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:32:29.306Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'a1209179-f3db-42b0-91da-cb6f34267db4',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'db3287dc-967f-4eac-8664-47df47016515',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'createdAt\':\'2023-07-06T06:08:21.802Z\',\'updatedAt\':\'2023-07-06T06:10:29.295Z\',\'id\':\'94351903-22f5-40e7-82f2-1ae809d4b1c3\',\'documentId\':\'a8394af6-e374-414b-947b-00ff1f359b98\',\'documentRevisionId\':\'1ffb0526-c330-4a48-868f-718d791ec6d9\',\'rootDocId\':\'PRT-03903-567\',\'suffixNumber\':\'567\',\'suffixName\':\'my heart \',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:19:19.298Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '2a78e9f2-2bf1-44da-acae-2053d9af2730',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '91b4e197-67d4-4a36-beb0-896d4c158ce0',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'data\':{\'createdAt\':\'2023-07-06T06:08:21.802Z\',\'updatedAt\':\'2023-07-06T06:08:21.802Z\',\'id\':\'94351903-22f5-40e7-82f2-1ae809d4b1c3\',\'documentId\':\'a8394af6-e374-414b-947b-00ff1f359b98\',\'documentRevisionId\':\'1ffb0526-c330-4a48-868f-718d791ec6d9\',\'rootDocId\':\'PRT-03903-567\',\'suffixNumber\':\'567\',\'suffixName\':\'my heart changes\',\'parentDocumentId\':\'61a4cdf0-4914-43c4-b98f-f57c04d86b1b\',\'parentDocumentRevisionId\':\'c7c8584b-e705-490e-acce-886f016496f8\',\'relatedStatus\':\'related_together\'}}',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:10:26.835Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'eb1bbdde-aa21-44a6-920c-330d7eddb0f6',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '7a324d29-fffd-4db0-85ba-9467e81d3766',
      'field': 'subParts',
      'type': 'ARRAY_NEW',
      'nextValue': 'PRT-03903-567',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:08:19.005Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'ab7923a4-3d39-493a-b9d6-e950d124a45a',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '09ece2fe-6cca-46f9-b2e2-163e89aaf2f6',
      'field': 'subParts',
      'type': 'ARRAY_EDITED',
      'nextValue': '{\'docID\':\'123\',\'Title\':\'my team member value \'}',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T06:05:31.731Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '1484c8ce-95fd-4323-b66f-97d1202f8ddb',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'e1c44d01-f7b6-426a-a6c2-b4f8f7d399b6',
      'field': 'subParts',
      'type': 'ARRAY_NEW',
      'nextValue': 'PRT-03903-123',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:52:02.897Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'd6bac611-2b6e-48c9-bc5e-d9efcc980735',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '33232ae6-452e-407e-b72c-beebcc066ba6',
      'field': 'relatedPartsStatus',
      'type': 'STRING_NEW',
      'nextValue': 'parent_together',
      'previousValue': null,
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:40.650Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': 'f0e4140f-22ca-44bc-b982-e6d4e795c4fd',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': '35c3a60c-f352-45be-b644-404a2a4a88d8',
      'field': 'document.docId',
      'type': 'STRING_NEW',
      'nextValue': 'PRT-03903',
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': null,
      'docId': 'EFM-00502'
  },
  {
      'id': '4779a26c-8f83-44b0-86b3-d7d42704a400',
      'field': 'securityGroups',
      'type': 'ARRAY_NEW',
      'nextValue': {
          'createdAt': '2020-02-18T12:32:51.085Z',
          'updatedAt': '2023-04-10T06:00:45.576Z',
          'id': 'b63e2c6b-bac5-4805-bcff-955e49fa0131',
          'name': 'Everyone',
          'permissions': [
              'EMPLOYEE_GET',
              'CR_ON_APPROVER_LIST',
              'CR_OWNER_AS_APPROVER'
          ],
          'defaultForNewUsers': true,
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'tags': [
              'QMS_DEFAULT',
              'OWNERSHIP_CHANGE',
              'FB_COMPONENT_INLINE_APPROVAL'
          ],
          'type': 'MANAGMENT',
          'isOfficial': true
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  },
  {
      'id': '477dba78-4f22-4b41-a363-6d7445da8a67',
      'field': 'securityGroups',
      'type': 'ARRAY_NEW',
      'nextValue': {
          'createdAt': '2022-07-07T07:25:47.123Z',
          'updatedAt': '2023-04-10T05:56:03.745Z',
          'id': 'dc78814d-a7ad-4a4a-8298-d45c9ef9c95a',
          'name': 'Product Team',
          'permissions': [
              'COMPANY_BOOTSTRAP',
              'COMPANY_CREATE',
              'COMPANY_DELETE',
              'COMPANY_GET',
              'COMPANY_UPDATE',
              'COMPANY_UPDATE_CURRENT',
              'CR_OWNER_AS_APPROVER',
              'CR_ON_APPROVER_LIST',
              'EMPLOYEE_CREATE',
              'EMPLOYEE_DELETE',
              'EMPLOYEE_GET',
              'EMPLOYEE_UPDATE',
              'EMPLOYEE_ADMIN_CREATE',
              'EMPLOYEE_ADMIN_DELETE',
              'EMPLOYEE_ADMIN_UPDATE',
              'EMPLOYEE_ADMIN_GET',
              'GROUP_CREATE',
              'GROUP_DELETE',
              'GROUP_UPDATE',
              'GROUP_GET',
              'GROUP_CREATE_UNOFFICIAL',
              'GROUP_UPDATE_UNOFFICIAL',
              'USERS_CREATE',
              'USERS_GET',
              'USERS_UPDATE',
              'REMOTE_VALIDATORS_REFRESH',
              'SLACK_APP_INSTALL',
              'DEVELOPERS',
              'DOC_REV_OBS_TO_RELEASED',
              'DOCUMENT_OWNER_CHANGE',
              'HTML_UPDATE',
              'SEND_PASSWORD_RESET_EMAIL',
              'DUE_TRAININGS',
              'ASYNC_TASKS_UI'
          ],
          'defaultForNewUsers': false,
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'tags': [
              'USER_MANAGEMENT',
              'GROUP_MANAGEMENT',
              'OWNERSHIP_CHANGE',
              'QMS_DEFAULT',
              'FB_COMPONENT_PURCHASE_ORDER',
              'FB_COMPONENT_RECEIVE_PURCHASE_ORDER',
              'FB_COMPONENT_INLINE_APPROVAL',
              'FB_COMPONENT_REQUEST_APPROVAL',
              'NAVIGATION_WITH_RESTRICTED_DOC_TYPES',
              'CREATE_DOCS_OF_RESTRICTED_DOC_TYPES',
              'DOCUMENT_TYPE_MANAGEMENT',
              'FB_COMPONENT_EQUIPMENT_MAINTENANCE',
              'LABEL_TOOLTIPS',
              'COMPANY_CONFIG_WHITELABELING',
              'COMPANY_CONFIG_NAVIGATION',
              'COMPANY_CONFIG_DOCUMENT_REV_STAGES',
              'PAGE_DETAILS_MANAGEMENT',
              'DASHBOARD_ADMIN',
              'ASYNC_TASKS_UI'
          ],
          'type': 'MANAGMENT',
          'isOfficial': true
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  },
  {
      'id': '07f9d51a-ac3a-4f02-841d-7be322555468',
      'field': 'displayStatus',
      'type': 'STRING_NEW',
      'nextValue': 'Draft',
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': false,
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'documentRevisionId': 'c7c8584b-e705-490e-acce-886f016496f8',
      'docId': 'PRT-03903'
  },
  {
      'id': 'f0f04826-335a-42fb-b3dc-1626f4d11eb8',
      'field': 'owner',
      'type': 'STRING_NEW',
      'nextValue': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  },
  {
      'id': 'e9b107eb-0adb-482e-8957-d97bece711e2',
      'field': 'formDocument',
      'type': 'STRING_NEW',
      'nextValue': {
          'createdAt': '2022-07-21T06:25:43.953Z',
          'updatedAt': '2022-07-21T06:25:57.302Z',
          'id': '990798f6-5e70-43fb-aa39-f23e46b7ef3d',
          'version': 1,
          'revision': 1,
          'subRevision': 0,
          'revisionStage': 1,
          'displayRevision': '1',
          'description': '<p>fvf</p>',
          'name': 'part',
          'status': 'RELEASED',
          'poStatus': 'OPENED',
          'displayStatus': 'Released',
          'deprecatedAt': null,
          'effectiveDate': '2022-07-20T07:00:00.000Z',
          'approvedAt': '2022-07-21T06:25:58.186Z',
          'releasedAt': '2022-07-21T06:25:58.450Z',
          'obsoletedAt': null,
          'voidedAt': null,
          'retrain': false,
          'redline': false,
          'formInput': null,
          'inputOwners': {},
          'downloadAllAttachmentsZipS3Link': null,
          'lastZipFileUpdate': null,
          'documentId': '514f6a35-aeba-4ea6-88c2-70d444769971',
          'changeRequestId': '453bcc59-f7e6-4af9-93c6-6b953ad3193e',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'revisionChangeType': 'NEXT_REVISION',
          'schema': null,
          'formDocumentId': null,
          'externalId': null,
          'renderHTMLDefined': false,
          'usedDocumentsInLHRS': null,
          'precalc': null,
          'document': {
              'createdAt': '2022-07-21T06:25:43.953Z',
              'updatedAt': '2022-07-21T06:25:43.953Z',
              'id': '514f6a35-aeba-4ea6-88c2-70d444769971',
              'docId': 'FM-03117',
              'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
              'massCreateExecuted': null,
              'typeSpecificConfig': null
          },
          'owner': {
              'createdAt': '2022-02-28T07:02:00.569Z',
              'updatedAt': '2022-07-07T07:25:47.123Z',
              'id': 'b4cddb73-5b89-49d4-93cb-55d409de6192',
              'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
              'active': true,
              'slackUserId': null,
              'user': {
                  'createdAt': '2022-02-28T07:02:00.569Z',
                  'updatedAt': '2023-01-16T07:40:28.755Z',
                  'id': 'e424710f-b9c1-4669-9135-55cdabc63df6',
                  'email': 'dsharma@enlil.com',
                  'name': 'Divya Sharma',
                  'confirmed': true,
                  'locked': true,
                  'passwordExpires': true,
                  'passwordLastEmailSentAt': '2023-01-02T08:00:00.000Z',
                  'passwordUpdatedAt': '2022-10-04T09:19:57.522Z',
                  'permissions': null,
                  'avatar': 'https://doc-be-dev-public.s3.us-west-2.amazonaws.com/cdce82eb-bf68-481e-af5f-f9c16853d7c0/2022-07-20T08%3A40%3A47.751Z/pexels-icon.jpeg',
                  'initialColor': '#fcfa97',
                  'resetPasswordEmailTimestamp': '2022-10-04T09:17:44.381Z',
                  'resendConfirmationEmailTimestamp': null,
                  'forgotPasswordEmailTimestamp': null,
                  'passwordSetTimestamp': '2022-10-04T09:19:57.738Z'
              }
          }
      },
      'previousValue': 'undefined',
      'hasPoReceivedQtyFlag': false,
      'timestamp': '2023-07-06T05:51:27.004Z',
      'owner': {
          'createdAt': '2022-07-27T10:14:09.006Z',
          'updatedAt': '2022-07-27T10:14:09.006Z',
          'id': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
          'companyId': 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
          'active': true,
          'slackUserId': null,
          'user': {
              'createdAt': '2022-07-27T10:14:09.006Z',
              'updatedAt': '2023-05-29T08:02:23.778Z',
              'id': '732da95d-0b91-4c64-9918-faaf55328b8b',
              'email': 'sgore@enlil.com',
              'name': 'Sandeep Gore',
              'confirmed': true,
              'locked': false,
              'passwordExpires': true,
              'passwordLastEmailSentAt': '2023-05-27T07:00:00.000Z',
              'passwordUpdatedAt': '2023-05-29T08:02:25.811Z',
              'permissions': null,
              'avatar': null,
              'initialColor': '#e285ca',
              'resetPasswordEmailTimestamp': '2023-05-29T07:58:51.800Z',
              'resendConfirmationEmailTimestamp': null,
              'forgotPasswordEmailTimestamp': '2023-02-27T07:46:26.863Z',
              'passwordSetTimestamp': '2023-05-29T08:02:26.074Z'
          }
      },
      'ownerId': '5d20afc5-8de7-49d5-ad0a-fae9d5232ef5',
      'ownerUserId': null,
      'groupId': '3516f32c-d54c-4965-b483-88d6fa684783',
      'isRelation': true,
      'isRelationProp': 'nextValue',
      'ownerEmail': 'sgore@enlil.com',
      'ownerName': 'Sandeep Gore',
      'docId': 'EFM-00502'
  }
];

