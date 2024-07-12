import { combineReducers } from 'redux';
import { CLEAN_UP_MAPPED_HEADERS, CURRENT_STEP, RESET_STEPS, SET_APPROVAL, SET_APPROVALS, SET_BULK_IMPORT, SET_BULK_IMPORTS, SET_DATA_TYPE_FILTER, SET_DATA_TYPES, SET_FORM_DOCUMENTS_TYPE_GROUP, SET_HEADERS, SET_IS_LOADING, SET_IS_LOADING_MAIN, SET_ONLY_ERRORS_TABLE, SET_SELECTED_TYPE, SET_SHOW_TABLE, SET_STATUS_FILTER, SET_TABLE_DATA, SET_TEMPLATE_FILE, SET_XLSX_FILE, UPDATE_ROW_FIELD_TABLE } from './constants';
import { BulkImport, BulkImportActions, BulkImportState, BulkImportStepsActions, BulkImportStepsState } from './types';

const BULK_IMPORT_DEFAULT_STEPS = {
  step: 0,
  dataType: '',
  formDocumentsTypeGroupList: [],
  dataTypeList: {},
  bulkImport: null,
  templateFile: [],
  xlsx: null,
  showTable: false,
  headers: null,
  isLoading: false,
  tableData: [],
  approvers: [],
  approval: null,
  showErrorsOnly: false,
};

const steps = (
  state: BulkImportStepsState = BULK_IMPORT_DEFAULT_STEPS,
  action: BulkImportStepsActions,
): BulkImportStepsState => {
  switch (action.type) {
    case RESET_STEPS:
      return BULK_IMPORT_DEFAULT_STEPS;
    case CURRENT_STEP:
      return {
        ...state,
        step: action.payload,
      };
    case SET_DATA_TYPES:
      return {
        ...state,
        dataTypeList: action.payload,
      };
    case SET_SELECTED_TYPE:
      return {
        ...state,
        dataType: action.payload,
      };
    case SET_FORM_DOCUMENTS_TYPE_GROUP:
      return {
        ...state,
        formDocumentsTypeGroupList: action.payload,
      };
    case SET_BULK_IMPORT:
      return {
        ...state,
        bulkImport: action.payload,
      };
    case SET_TEMPLATE_FILE:
      return {
        ...state,
        templateFile: action.payload,
      };
    case SET_XLSX_FILE:
      return {
        ...state,
        xlsx: action.payload,
      };
    case SET_SHOW_TABLE:
      return {
        ...state,
        showTable: action.payload,
      };
    case SET_ONLY_ERRORS_TABLE:
      return {
        ...state,
        showErrorsOnly: action.payload,
      };
    case SET_HEADERS:
      return {
        ...state,
        headers: action.payload,
      };
    case SET_TABLE_DATA:
      return {
        ...state,
        tableData: action.payload,
      };
    case SET_APPROVALS:
      return {
        ...state,
        approvers: action.payload,
      };
    case SET_APPROVAL:
      return {
        ...state,
        approval: action.payload,
      };
    case CLEAN_UP_MAPPED_HEADERS:
      return {
        ...state,
        bulkImport: state?.bulkImport
          ? { ...state.bulkImport, mappedHeaders: {} as BulkImport['mappedHeaders'] }
          : state.bulkImport,
      };
    case UPDATE_ROW_FIELD_TABLE:
      return {
        ...state,
        tableData: state.tableData.map((table, idx) => {
          if (idx === action.payload.dataIndex) {
            const updatedErrors = table.errors?.map(error => {
              if (error.column === action.payload.field) {
                error.edited = true;
              }

              return error;
            }) ?? [];
            return { ...table, [action.payload.field]: action.payload.cellValue, errors: updatedErrors };
          }

          return table;
        }),
      };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const BULK_IMPORT_DEFAULT = {
  bulkImports: [],
  isLoading: false,
  selectedDataType: '',
  selectedStatus: '',
};

const main = (
  state: BulkImportState = BULK_IMPORT_DEFAULT,
  action: BulkImportActions,
): BulkImportState => {
  switch (action.type) {
    case SET_BULK_IMPORTS:
      return {
        ...state,
        bulkImports: action.payload,
      };
    case SET_IS_LOADING_MAIN:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_DATA_TYPE_FILTER:
      return {
        ...state,
        selectedDataType: action.payload,
      };
    case SET_STATUS_FILTER:
      return {
        ...state,
        selectedStatus: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  main,
  steps,
});
