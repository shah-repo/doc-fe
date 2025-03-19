import { SelectOption } from '../../../ui/components/forms/fields/Select';
import { ApplicationState } from '../../reducers';
import { ApproverOption, BkStatus, BulkImport, BulkImportCustom, BulkImportsMapData, TableRow, TableRowWithIdx } from './types';
import { getBulkImportCustomData } from './utils';

// STEPS
export const getStep = (state: ApplicationState) => state.bulkImport.steps.step;
export const getDataTypeSelectList = (state: ApplicationState): SelectOption[] =>
  state.bulkImport.steps.dataTypeList && Object.keys(state.bulkImport.steps.dataTypeList).length > 0
    ? Object.entries(state.bulkImport.steps.dataTypeList).map(([value, text]) => ({
      value,
      text,
    }))
    : [];
export const getFormDocumentsTypeGroupSelectList = (state: ApplicationState): SelectOption[] =>
  state.bulkImport.steps.formDocumentsTypeGroupList.map((docTypeGroup) => ({
    value: docTypeGroup.id,
    text: `${docTypeGroup?.document?.docId}${docTypeGroup.displayRevision && '.'}${docTypeGroup.displayRevision} - ${docTypeGroup.name}`,
  }));
export const getBulkImport = (state: ApplicationState) => state.bulkImport.steps.bulkImport;
export const getTemplateFile = (state: ApplicationState) => state.bulkImport.steps.templateFile;
export const getShowTable = (state: ApplicationState) => state.bulkImport.steps.showTable;
export const getHeaders = (state: ApplicationState) => state.bulkImport.steps.headers;
export const getTableData = (state: ApplicationState) => state.bulkImport.steps.tableData;
export const getShowErrorsOnly = (state: ApplicationState) => state.bulkImport.steps.showErrorsOnly;
export const getTableDataFiltered = (state: ApplicationState) => {
  const showErrorsOnly = state.bulkImport.steps.showErrorsOnly;
  const tableData: TableRow[] = state.bulkImport.steps.tableData || [];
  const newTableData: TableRowWithIdx[] = tableData.map((table, idx) => ({ ...table, idx }));

  if (showErrorsOnly) {
    return newTableData.filter((item) => item.errors && item.errors.length > 0 && item.errors.some(err => !err.edited));
  }

  return newTableData || [];
};
export const getIsLoading = (state: ApplicationState) => state.bulkImport.steps.isLoading;
export const getHasUnsavedChanges = (state: ApplicationState) => state.bulkImport.steps.hasUnsavedChanges;
export const getApproversSelectList = (state: ApplicationState): ApproverOption[] =>
  state.bulkImport.steps.approvers.map((approver) => ({
    value: approver?.id,
    text: approver?.user?.name,
    email: approver?.user?.email,
    avatar: approver?.user?.avatar,
  }));
// MAIN
export const getBulkImports = (state: ApplicationState) => state.bulkImport.main.bulkImports;
// We are going to create a map with the id of the BK and the jobId as they are never be similar Ex: JobId: DOCUMENT-001, BK id would be a uuid
// We need this map to avoid multiple loops on the audit logs because we have the jobId or bulkImportId
export const getBulkImportsMap = (state: ApplicationState): BulkImportsMapData => {
  const bulkImportIds: Record<string, BulkImport> = {};
  const documentRevisionIds: Record<string, BulkImport> = {};
  const approvalIds: Record<string, BulkImport> = {};

  state.bulkImport.main.bulkImports.forEach(({ id, jobId, documentRevision, ...rest }) => {
    const bulkImport = { id, jobId, documentRevision, ...rest };
    bulkImportIds[id] = bulkImportIds[jobId] = bulkImport;

    if (documentRevision) {
      documentRevisionIds[documentRevision.id] = bulkImport;

      if (documentRevision.approvals) {
        documentRevision.approvals.forEach(approval => {
          approvalIds[approval.id] = bulkImport;
        });
      }
    }
  });

  return {
    bulkImportIds,
    documentRevisionIds,
    approvalIds,
  };
};
export const getBulkImportsGroupByProcess = (state: ApplicationState): Record<string, BulkImportCustom[]> => {
  const filterDataType = state.bulkImport.main.selectedDataType;
  const filterStatus = state.bulkImport.main.selectedStatus;
  return state.bulkImport.main.bulkImports.reduce<Record<string, BulkImportCustom[]>>((acc, bulkImport) => {
    // Skip bulk imports with status DELETED
    if (bulkImport.status === BkStatus.DELETED) {
      return acc;
    }

    const processType = bulkImport.processType;
    // As we need the rejected status as a started we change internally the group.
    const status = bulkImport?.status === BkStatus.CANCELLED
      ? BkStatus.STARTED
      : bulkImport.status;

    // Create the custom bulk import
    const bulkImportWithCustom: BulkImportCustom = getBulkImportCustomData(bulkImport);
    // Apply filters before adding to accumulator
    if ((!filterDataType || processType === filterDataType) && (!filterStatus || status === filterStatus)) {
      acc[status] = [...(acc[status] ?? []), bulkImportWithCustom];
    }
    return acc;
  }, {});
};
export const getBulkImportsGroupByProcessType = (state: ApplicationState): Record<string, BulkImport[]> => {
  const filterDataType = state.bulkImport.main.selectedDataType;
  const filterStatus = state.bulkImport.main.selectedStatus;
  return state.bulkImport.main.bulkImports.reduce<Record<string, BulkImport[]>>((acc, bulkImport) => {
    // Skip bulk imports with status DELETED
    if (bulkImport.status === BkStatus.DELETED) {
      return acc;
    }

    const processType = bulkImport.processType;
    // As we need the rejected status as a started we change internally the group.
    const status = bulkImport?.status === BkStatus.CANCELLED
      ? BkStatus.STARTED
      : bulkImport.status;
    // Apply filters before adding to accumulator
    if ((!filterDataType || processType === filterDataType) && (!filterStatus || status === filterStatus)) {
      acc[processType] = [...(acc[processType] ?? []), bulkImport];
    }
    return acc;
  }, {});
};
export const getIsLoadingMain = (state: ApplicationState) => state.bulkImport.main.isLoading;
