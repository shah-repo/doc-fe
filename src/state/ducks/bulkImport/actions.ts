import { orderBy } from 'lodash';
import { FileWithPreview } from '../../../ui/components/forms/fields-next/Dropzone/Dropzone.types';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { Approval } from '../common/types';
import { approvalFieldId, APPROVALS_URL, BULK_DOWNLOAD_FILE_URL, BULK_GET_APPROVERS_URL, BULK_GET_REPORTS_EXCEL_URL, BULK_HEADERS_TO_MAP_URL, BULK_IMPORT_CREATE_URL, BULK_IMPORT_FORM_DOCUMENTS_TYPE_GROUP_URL, BULK_IMPORT_TYPE_DATA_URL, BULK_IMPORT_UPLOAD_DATA_URL, BULK_IMPORT_UPLOAD_S3_URL, BULK_IMPORT_URL, BULK_SET_DATA_URL, BULK_TABLE_DATA, CURRENT_STEP, DOCUMENT_REVISION_IN_REVIEW_URL, DOCUMENT_REVISION_URL, documentRevisionFormInput, RESET_STEPS, SET_APPROVAL, SET_APPROVALS, SET_BULK_IMPORT, SET_BULK_IMPORTS, SET_DATA_TYPE_FILTER, SET_DATA_TYPES, SET_FORM_DOCUMENTS_TYPE_GROUP, SET_HEADERS, SET_IS_LOADING, SET_IS_LOADING_MAIN, SET_ONLY_ERRORS_TABLE, SET_SELECTED_TYPE, SET_SHOW_TABLE, SET_STATUS_FILTER, SET_TABLE_DATA, SET_TEMPLATE_FILE, SET_XLSX_FILE, UPDATE_ROW_FIELD_TABLE } from './constants';
import { Approver, BKAttachmentFile, BulkImport, DataType, FormDocumentTypeGroup, TableRow, UpdateRowFieldTablePayload } from './types';
import { downloadFile } from './utils';

// STEPS

export const resetSteps = () => ({
  type: RESET_STEPS,
});

export const setCurrentStep = (step: number) => ({
  type: CURRENT_STEP,
  payload: step,
});

export const setSelectedDataType = (type: string) => ({
  type: SET_SELECTED_TYPE,
  payload: type,
});

export const setDataTypes = (data: DataType) => ({
  type: SET_DATA_TYPES,
  payload: data,
});

export const setFormDocumentsTypeGroup = (data: FormDocumentTypeGroup[]) => ({
  type: SET_FORM_DOCUMENTS_TYPE_GROUP,
  payload: data,
});

export const setBulkImport = (data: BulkImport) => ({
  type: SET_BULK_IMPORT,
  payload: data,
});

export const setTemplateFile = (file: File[]) => ({
  type: SET_TEMPLATE_FILE,
  payload: file,
});

export const setXlsxFile = (attachment: BKAttachmentFile) => ({
  type: SET_XLSX_FILE,
  payload: attachment,
});

export const setShowTable = (payload: boolean) => ({
  type: SET_SHOW_TABLE,
  payload,
});

export const setOnlyErrorsTable = (payload: boolean) => ({
  type: SET_ONLY_ERRORS_TABLE,
  payload,
});

export const setHeaders = (payload: Headers) => ({
  type: SET_HEADERS,
  payload,
});

export const setTableData = (payload: TableRow[]) => ({
  type: SET_TABLE_DATA,
  payload,
});

export const updateRowFieldTable = (payload: UpdateRowFieldTablePayload) => ({
  type: UPDATE_ROW_FIELD_TABLE,
  payload,
});

export const setApprovers = (payload: Approver[]) => ({
  type: SET_APPROVALS,
  payload,
});

export const setApproval = (payload: Approval) => ({
  type: SET_APPROVAL,
  payload,
});

export const setBulkImports = (payload: BulkImport[]) => ({
  type: SET_BULK_IMPORTS,
  payload,
});

export const setIsLoading = (payload: boolean) => ({
  type: SET_IS_LOADING,
  payload,
});

export const setDataTypeFilter = (payload: string) => ({
  type: SET_DATA_TYPE_FILTER,
  payload,
});

export const setStatusFilter = (payload: string) => ({
  type: SET_STATUS_FILTER,
  payload,
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
});

export const getReportsExcelFile = (bulkImportId: string): ApiAction<Blob> => apiAction({
  url: `${BULK_GET_REPORTS_EXCEL_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, _) => {
    downloadFile(data, 'template.xlsx');
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

export const getDownloadFile = (bulkImportId: string): ApiAction<Blob> => apiAction({
  url: `${BULK_DOWNLOAD_FILE_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, _) => {
    downloadFile(data, 'report.xlsx');
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
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
});

export const createBulkImport = (
  body: {formId: string, processId: string},
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
  onFailure: (message, dispatch) => {
    dispatch(setIsLoading(false));
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
  onSuccess: (data, dispatch) => {
    console.log('🚀 ~ saveDocumentRevisions data:', data);
  },
  onFailure: (message, dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
});

export const saveDocumentRevisionsInReview = (
  body: { documentRevisionId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_IN_REVIEW_URL}${body.documentRevisionId}`,
  method: 'post',
  onSuccess: (data, dispatch) => {
    console.log('🚀 ~ saveDocumentRevisionsInReview data:', data);
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
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
    onSuccess: (data, dispatch) => {
      console.log('🚀 ~ data:', data);
    },
    onCompleted: (dispatch) => {
      dispatch(setIsLoading(false));
    },
    handlers,
  });
};

// MAIN
export const setIsLoadingMain = (payload: boolean) => ({
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
});
