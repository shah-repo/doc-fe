import { BkStatus } from './types';

export const BULK_IMPORT_URL = '/bulk_import/';
export const BULK_IMPORT_ONE_URL = '/bulk_import/one/';
export const BULK_IMPORT_TYPE_DATA_URL = '/bulk_import/get_bulk_import_type_data';
export const BULK_IMPORT_FORM_DOCUMENTS_TYPE_GROUP_URL = '/bulk_import/get_forms_for_document_type_group';
export const BULK_IMPORT_CREATE_URL = '/bulk_import/create';
export const BULK_IMPORT_UPLOAD_DATA_URL = '/bulk_import/upload/';
export const BULK_IMPORT_UPLOAD_S3_URL = '/bulk_import/upload_s3/';
export const BULK_HEADERS_TO_MAP_URL = '/bulk_import/headers_to_map/';
export const BULK_TABLE_DATA = '/bulk_import/bulk_import_data/';
export const BULK_DOWNLOAD_FILE_URL = '/bulk_import/download_file/';
export const BULK_SET_DATA_URL = '/bulk_import/set_data/';
export const BULK_GET_APPROVERS_URL = '/bulk_import/bulk_import_approvers/';
export const BULK_GET_REPORTS_EXCEL_URL = '/bulk_import/get_bulk_import_reports_in_excel/';
export const APPROVALS_URL = '/approvals';
export const DOCUMENT_REVISION_URL = '/document_revisions/';
export const DOCUMENT_REVISION_IN_REVIEW_URL = '/document_revisions/in_review/';
export const DOCUMENT_REVISION_WITHDRAWN_URL = '/document_revisions/withdrawn/';

export const RESET_STEPS = 'bulkImport/RESET_STEPS';
export const CURRENT_STEP = 'bulkImport/CURRENT_STEP';
export const SET_BULK_IMPORT = 'bulkImport/SET_BULK_IMPORT';
export const DELETE_BULK_IMPORT = 'bulkImport/DELETE_BULK_IMPORT';
export const SET_BULK_IMPORTS = 'bulkImport/SET_BULK_IMPORTS';
export const SET_SELECTED_TYPE = 'bulkImport/SET_SELECTED_TYPE';
export const SET_DATA_TYPES = 'bulkImport/SET_DATA_TYPES';
export const SET_FORM_DOCUMENTS_TYPE_GROUP = 'bulkImport/SET_FORM_DOCUMENTS_TYPE_GROUP';
export const SET_TEMPLATE_FILE = 'bulkImport/SET_TEMPLATE_FILE';
export const SET_SHOW_TABLE = 'bulkImport/SET_SHOW_TABLE';
export const SET_ONLY_ERRORS_TABLE = 'bulkImport/SET_ONLY_ERRORS_TABLE';
export const SET_HEADERS = 'bulkImport/SET_HEADERS';
export const SET_TABLE_DATA = 'bulkImport/SET_TABLE_DATA';
export const UPDATE_ROW_FIELD_TABLE = 'bulkImport/UPDATE_ROW_FIELD_TABLE';
export const SET_APPROVALS = 'bulkImport/SET_APPROVALS';
export const SET_APPROVAL = 'bulkImport/SET_APPROVAL';
export const SET_IS_LOADING = 'bulkImport/SET_IS_LOADING';
export const SET_HAS_UNSAVED_CHANGES = 'bulkImport/SET_HAS_UNSAVED_CHANGES';
export const SET_IS_LOADING_MAIN = 'bulkImport/SET_IS_LOADING_MAIN';
export const SET_DATA_TYPE_FILTER = 'bulkImport/SET_DATA_TYPE_FILTER';
export const SET_STATUS_FILTER = 'bulkImport/SET_STATUS_FILTER';
export const CLEAN_UP_MAPPED_HEADERS = 'bulkImport/CLEAN_UP_MAPPED_HEADERS';
export const SET_BULK_IMPORTS_STATUS = 'bulkImport/SET_BULK_IMPORTS_STATUS';

export const approvalFieldPrefix = 'fb-approvals-fb-approvals-';
export const skippedAttachmentFile = 'skipped';

export const bkStatusTextMap: { [key in BkStatus]: string } = {
  [BkStatus.STARTED]: 'Started',
  [BkStatus.IN_PROGRESS]: 'In progress',
  [BkStatus.SUCCESS]: 'Success',
  [BkStatus.FAILED]: 'Failed',
  [BkStatus.CANCELLED]: 'Rejected',
  [BkStatus.COMPLETED]: 'Completed',
  [BkStatus.DELETED]: 'Deleted',
};
