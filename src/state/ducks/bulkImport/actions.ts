import { orderBy } from 'lodash';
import { FileWithPreview } from '../../../ui/components/forms/fields-next/Dropzone/Dropzone.types';
import { toastError } from '../../../ui/components/notifications';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { Approval } from '../common/types';
import { approvalFieldId, APPROVALS_URL, BULK_GET_APPROVERS_URL, BULK_GET_REPORTS_EXCEL_URL, BULK_HEADERS_TO_MAP_URL, BULK_IMPORT_CREATE_URL, BULK_IMPORT_FORM_DOCUMENTS_TYPE_GROUP_URL, BULK_IMPORT_TYPE_DATA_URL, BULK_IMPORT_UPLOAD_DATA_URL, BULK_IMPORT_UPLOAD_S3_URL, BULK_IMPORT_URL, BULK_SET_DATA_URL, BULK_TABLE_DATA, CLEAN_UP_MAPPED_HEADERS, CURRENT_STEP, DOCUMENT_REVISION_IN_REVIEW_URL, DOCUMENT_REVISION_URL, documentRevisionFormInput, RESET_STEPS, SET_APPROVAL, SET_APPROVALS, SET_BULK_IMPORT, SET_BULK_IMPORTS, SET_DATA_TYPE_FILTER, SET_DATA_TYPES, SET_FORM_DOCUMENTS_TYPE_GROUP, SET_HEADERS, SET_IS_LOADING, SET_IS_LOADING_MAIN, SET_ONLY_ERRORS_TABLE, SET_SHOW_TABLE, SET_STATUS_FILTER, SET_TABLE_DATA, SET_TEMPLATE_FILE, SET_XLSX_FILE, UPDATE_ROW_FIELD_TABLE } from './constants';
import { Approver, BKAttachmentFile, BulkImport, DataType, FormDocumentTypeGroup, TableRow, UpdateRowFieldTablePayload } from './types';
import { downloadFile } from './utils';

const REPORT_CSV = 'report.csv';

// STEPS

export const resetSteps = (): { type: string } => ({
  type: RESET_STEPS,
});

export const setCurrentStep = (step: number): { type: string, payload: number } => ({
  type: CURRENT_STEP,
  payload: step,
});

const setDataTypes = (data: DataType): { type: string, payload: DataType } => ({
  type: SET_DATA_TYPES,
  payload: data,
});

const setFormDocumentsTypeGroup = (data: FormDocumentTypeGroup[]): { type: string, payload: FormDocumentTypeGroup[] } => ({
  type: SET_FORM_DOCUMENTS_TYPE_GROUP,
  payload: data,
});

export const setBulkImport = (data: BulkImport): { type: string, payload: BulkImport } => ({
  type: SET_BULK_IMPORT,
  payload: data,
});

export const setTemplateFile = (file: File[]): { type: string, payload: File[] } => ({
  type: SET_TEMPLATE_FILE,
  payload: file,
});

const setXlsxFile = (attachment: BKAttachmentFile): { type: string, payload: BKAttachmentFile } => ({
  type: SET_XLSX_FILE,
  payload: attachment,
});

export const setShowTable = (payload: boolean): { type: string, payload: boolean } => ({
  type: SET_SHOW_TABLE,
  payload,
});

export const setOnlyErrorsTable = (payload: boolean): { type: string, payload: boolean } => ({
  type: SET_ONLY_ERRORS_TABLE,
  payload,
});

const setHeaders = (payload: Headers): { type: string, payload: Headers } => ({
  type: SET_HEADERS,
  payload,
});

export const setTableData = (payload: TableRow[]): { type: string, payload: TableRow[] } => ({
  type: SET_TABLE_DATA,
  payload,
});

export const updateRowFieldTable = (payload: UpdateRowFieldTablePayload): { type: string, payload: UpdateRowFieldTablePayload } => ({
  type: UPDATE_ROW_FIELD_TABLE,
  payload,
});

const setApprovers = (payload: Approver[]): { type: string, payload: Approver[] } => ({
  type: SET_APPROVALS,
  payload,
});

const setApproval = (payload: Approval): { type: string, payload: Approval } => ({
  type: SET_APPROVAL,
  payload,
});

const setBulkImports = (payload: BulkImport[]): { type: string, payload: BulkImport[] } => ({
  type: SET_BULK_IMPORTS,
  payload,
});

export const setIsLoading = (payload: boolean): { type: string, payload: boolean } => ({
  type: SET_IS_LOADING,
  payload,
});

export const setDataTypeFilter = (payload: string): { type: string, payload: string } => ({
  type: SET_DATA_TYPE_FILTER,
  payload,
});

export const setStatusFilter = (payload: string): { type: string, payload: string } => ({
  type: SET_STATUS_FILTER,
  payload,
});

export const cleanUpMappedHeaders = (): { type: string } => ({
  type: CLEAN_UP_MAPPED_HEADERS,
});

export const getDataTypes = (): ApiAction<DataType> => apiAction({
  url: BULK_IMPORT_TYPE_DATA_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setDataTypes(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const getFormDocumentsTypeGroup = (option: string): ApiAction<FormDocumentTypeGroup[]> => apiAction({
  url: `${BULK_IMPORT_FORM_DOCUMENTS_TYPE_GROUP_URL}?form_option=${option}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setFormDocumentsTypeGroup(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const getHeadersToMap = (bulkImportId: string): ApiAction<Headers> => apiAction({
  url: `${BULK_HEADERS_TO_MAP_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setHeaders(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const getBulkImportTableData = (bulkImportId: string): ApiAction<TableRow[]> => apiAction({
  url: `${BULK_TABLE_DATA}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setTableData(data && Array.isArray(data) ? data : []));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const getReportsExcelFile = (bulkImportId: string): ApiAction<Blob> => apiAction({
  url: `${BULK_GET_REPORTS_EXCEL_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, _) => {
    downloadFile(data, REPORT_CSV);
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const getApprovers = (): ApiAction<Approver[]> => apiAction({
  url: BULK_GET_APPROVERS_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setApprovers(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const createBulkImport = (
  body: {formId?: string, processType: string},
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: BULK_IMPORT_CREATE_URL,
  method: 'post',
  data: body,
  onSuccess: (data, dispatch) => {
    dispatch(setBulkImport(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const uploadFileData = (
  body: {file: FileWithPreview, bulkImportId: string},
  handlers: Handlers,
): ApiAction => {
  const formData = new FormData();
  formData.append('file', body.file);

  return apiActionWithCallbacks({
    url: `${BULK_IMPORT_UPLOAD_DATA_URL}${body.bulkImportId}`,
    method: 'post',
    data: formData,
    onSuccess: (data, dispatch) => {
      dispatch(setXlsxFile(data));
    },
    onCompleted: (dispatch) => {
      dispatch(setIsLoading(false));
    },
    handlers,
    onFailure: (err: string) => {
      toastError(err);
    },
  });
};

export const saveHeaderToMap = (
  body: { headers: Headers, bulkImportId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${BULK_HEADERS_TO_MAP_URL}${body.bulkImportId}`,
  method: 'post',
  data: { ...body.headers },
  onSuccess: (data, dispatch) => {
    dispatch(setTableData(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const setDataTable = (
  body: { data: TableRow[], bulkImportId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${BULK_SET_DATA_URL}${body.bulkImportId}`,
  method: 'post',
  data: { data: JSON.stringify(body.data) },
  onSuccess: (data, dispatch) => {
    dispatch(setBulkImport(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const saveApprovals = (
  body: { approval: string, documentRevisionId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${APPROVALS_URL}`,
  method: 'post',
  data: {
    assigned: {
      id: body.approval,
    },
    type: 'MASTER',
    fieldId: approvalFieldId,
    partOf: {
      id: body.documentRevisionId,
    },
  },
  onSuccess: (data, dispatch) => {
    dispatch(setApproval(data));
  },
  onFailure: (err, dispatch) => {
    dispatch(setIsLoading(false));
    toastError(err);
  },
  handlers,
});

export const saveDocumentRevisions = (
  body: { approvalId: string, documentRevisionId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_URL}${body.documentRevisionId}`,
  method: 'patch',
  data: { formInput: { [documentRevisionFormInput]: [body.approvalId] } },
  onFailure: (err, dispatch) => {
    dispatch(setIsLoading(false));
    toastError(err);
  },
  handlers,
});

export const saveDocumentRevisionsInReview = (
  body: { documentRevisionId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_IN_REVIEW_URL}${body.documentRevisionId}`,
  method: 'post',
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
  onFailure: (err: string) => {
    toastError(err);
  },
});

export const uploadS3 = (
  body: {file: FileWithPreview, link: string, bulkImportId: string},
  handlers: Handlers,
): ApiAction => {
  const formData = new FormData();

  if (body.file) {
    formData.append('file', body.file);
  }

  if (body.link && body.link.trim() !== '') {
    formData.append('link', body.link);
  }

  return apiActionWithCallbacks({
    url: `${BULK_IMPORT_UPLOAD_S3_URL}${body.bulkImportId}`,
    method: 'post',
    data: formData,
    onCompleted: (dispatch) => {
      dispatch(setIsLoading(false));
    },
    handlers,
    onFailure: (err: string) => {
      toastError(err);
    },
  });
};

// MAIN
export const setIsLoadingMain = (payload: boolean): { type: string, payload: boolean } => ({
  type: SET_IS_LOADING_MAIN,
  payload,
});

export const getBulkImports = (): ApiAction<BulkImport[]> => apiAction({
  url: BULK_IMPORT_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    const bulkImportDataSorted = orderBy(data, 'createdAt', 'desc');
    dispatch(setBulkImports(bulkImportDataSorted));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoadingMain(false));
  },
  onFailure: (err: string) => {
    toastError(err);
  },
});
