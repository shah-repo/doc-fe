import { FileWithPreview } from '../../../ui/components/forms/fields-next/Dropzone/Dropzone.field';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { Approval } from '../common/types';
import { APPROVALS_URL, BULK_DOWNLOAD_FILE_URL, BULK_GET_APPROVERS_URL, BULK_GET_REPORTS_EXCEL_URL, BULK_HEADERS_TO_MAP_URL, BULK_IMPORT_CREATE_URL, BULK_IMPORT_FORM_DOCUMENTS_TYPE_GROUP_URL, BULK_IMPORT_TYPE_DATA_URL, BULK_IMPORT_UPLOAD_DATA_URL, BULK_IMPORT_UPLOAD_S3_URL, BULK_IMPORT_URL, BULK_SET_DATA_URL, BULK_TABLE_DATA, CURRENT_STEP, DOCUMENT_REVISION_IN_REVIEW_URL, DOCUMENT_REVISION_URL, RESET_STEPS, SET_APPROVAL, SET_APPROVALS, SET_BULK_IMPORT, SET_BULK_IMPORTS, SET_DATA_TYPE_FILTER, SET_DATA_TYPES, SET_FORM_DOCUMENTS_TYPE_GROUP, SET_HEADERS, SET_IS_LOADING, SET_IS_LOADING_MAIN, SET_ONLY_ERRORS_TABLE, SET_SELECTED_TYPE, SET_SHOW_TABLE, SET_STATUS_FILTER, SET_TABLE_DATA, SET_TEMPLATE_FILE, SET_XLSX_FILE, UPDATE_ROW_FIELD_TABLE } from './constants';
import { Approver, AttachmentFile, BulkImport, DataType, FormDocumentTypeGroup, TableRow, UpdateRowFieldTablePayload } from './types';

// STEPS

const resetSteps = () => ({
  type: RESET_STEPS,
});

const setCurrentStep = (step: number) => ({
  type: CURRENT_STEP,
  payload: step,
});

const setSelectedDataType = (type: string) => ({
  type: SET_SELECTED_TYPE,
  payload: type,
});

const setDataTypes = (data: DataType) => ({
  type: SET_DATA_TYPES,
  payload: data,
});

const setFormDocumentsTypeGroup = (data: FormDocumentTypeGroup[]) => ({
  type: SET_FORM_DOCUMENTS_TYPE_GROUP,
  payload: data,
});

const setBulkImport = (data: BulkImport) => ({
  type: SET_BULK_IMPORT,
  payload: data,
});

const setTemplateFile = (file: File[]) => ({
  type: SET_TEMPLATE_FILE,
  payload: file,
});

const setXlsxFile = (attachment: AttachmentFile) => ({
  type: SET_XLSX_FILE,
  payload: attachment,
});

const setShowTable = (bool: boolean) => ({
  type: SET_SHOW_TABLE,
  payload: bool,
});

const setOnlyErrorsTable = (bool: boolean) => ({
  type: SET_ONLY_ERRORS_TABLE,
  payload: bool,
});

const setHeaders = (payload: Headers) => ({
  type: SET_HEADERS,
  payload,
});

const setTableData = (payload: TableRow[]) => ({
  type: SET_TABLE_DATA,
  payload,
});

const updateRowFieldTable = (payload: UpdateRowFieldTablePayload) => ({
  type: UPDATE_ROW_FIELD_TABLE,
  payload,
});

const setApprovers = (payload: Approver[]) => ({
  type: SET_APPROVALS,
  payload,
});

const setApproval = (payload: Approval) => ({
  type: SET_APPROVAL,
  payload,
});

const setBulkImports = (payload: BulkImport[]) => ({
  type: SET_BULK_IMPORTS,
  payload,
});

const setIsLoading = (payload: boolean) => ({
  type: SET_IS_LOADING,
  payload,
});

const setDataTypeFilter = (payload: string) => ({
  type: SET_DATA_TYPE_FILTER,
  payload,
});

const setStatusFilter = (payload: string) => ({
  type: SET_STATUS_FILTER,
  payload,
});

const getDataTypes = (): ApiAction<DataType> => apiAction({
  url: BULK_IMPORT_TYPE_DATA_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setDataTypes(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const getFormDocumentsTypeGroup = (option: string): ApiAction<FormDocumentTypeGroup[]> => apiAction({
  url: `${BULK_IMPORT_FORM_DOCUMENTS_TYPE_GROUP_URL}?form_option=${option}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setFormDocumentsTypeGroup(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const getHeadersToMap = (bulkImportId: string): ApiAction<Headers> => apiAction({
  url: `${BULK_HEADERS_TO_MAP_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setHeaders(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const getBulkImportTableData = (bulkImportId: string): ApiAction<TableRow[]> => apiAction({
  url: `${BULK_TABLE_DATA}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setTableData(data && Array.isArray(data) ? data : []));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const getReportsExcelFile = (bulkImportId: string): ApiAction<Blob> => apiAction({
  url: `${BULK_GET_REPORTS_EXCEL_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    // download the file
    const file = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a URL for the blob object
    const fileURL = URL.createObjectURL(file);

    // Create a temporary link element and trigger the download
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'template.xlsx'); // Set the file name for download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    if (link?.parentNode) link.parentNode.removeChild(link);

    // Optional: Release the object URL
    URL.revokeObjectURL(fileURL);
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const getDownloadFile = (bulkImportId: string): ApiAction<Blob> => apiAction({
  url: `${BULK_DOWNLOAD_FILE_URL}${bulkImportId}`,
  method: 'get',
  onSuccess: (data, dispatch) => {
    // download the file
    const file = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a URL for the blob object
    const fileURL = URL.createObjectURL(file);

    // Create a temporary link element and trigger the download
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'template.xlsx'); // Set the file name for download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    if (link?.parentNode) link.parentNode.removeChild(link);

    // Optional: Release the object URL
    URL.revokeObjectURL(fileURL);
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const getApprovers = (): ApiAction<Approver[]> => apiAction({
  url: BULK_GET_APPROVERS_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setApprovers(data));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoading(false));
  },
});

const createBulkImport = (
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

const uploadFileData = (
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

const saveHeaderToMap = (
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

const setDataTable = (
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

const saveApprovals = (
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
    fieldId: 'fb-approvals-kn7izl3v',
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

const saveDocumentRevisions = (
  body: { approvalId: string, documentRevisionId: string },
  handlers: Handlers,
): ApiAction => apiActionWithCallbacks({
  url: `${DOCUMENT_REVISION_URL}${body.documentRevisionId}`,
  method: 'patch',
  data: { formInput: { 'fb-approvals-fb-approvals-kn7izlov': [body.approvalId] } },
  onSuccess: (data, dispatch) => {
    console.log('🚀 ~ saveDocumentRevisions data:', data);
  },
  onFailure: (message, dispatch) => {
    dispatch(setIsLoading(false));
  },
  handlers,
});

const saveDocumentRevisionsInReview = (
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

const uploadS3 = (
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
const setIsLoadingMain = (payload: boolean) => ({
  type: SET_IS_LOADING_MAIN,
  payload,
});

const getBulkImports = (): ApiAction<BulkImport[]> => apiAction({
  url: BULK_IMPORT_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    const bulkImportDataSorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    dispatch(setBulkImports(bulkImportDataSorted));
  },
  onCompleted: (dispatch) => {
    dispatch(setIsLoadingMain(false));
  },
});

export default {
  resetSteps,
  setCurrentStep,
  setSelectedDataType,
  setDataTypes,
  setFormDocumentsTypeGroup,
  getDataTypes,
  getFormDocumentsTypeGroup,
  createBulkImport,
  setTemplateFile,
  uploadFileData,
  setXlsxFile,
  setShowTable,
  setOnlyErrorsTable,
  setTableData,
  getHeadersToMap,
  getBulkImportTableData,
  getReportsExcelFile,
  getDownloadFile,
  setHeaders,
  setIsLoading,
  setIsLoadingMain,
  saveHeaderToMap,
  updateRowFieldTable,
  setDataTable,
  uploadS3,
  getApprovers,
  setApprovers,
  saveApprovals,
  setApproval,
  saveDocumentRevisions,
  saveDocumentRevisionsInReview,
  getBulkImports,
  setBulkImports,
  setBulkImport,
  setDataTypeFilter,
  setStatusFilter,
};
