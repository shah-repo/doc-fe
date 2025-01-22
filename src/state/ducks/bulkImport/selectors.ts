import { isEmpty } from 'lodash';
import { translate } from '../../../common/intl';
import { SelectOption } from '../../../ui/components/forms/fields/Select';
import { ApplicationState } from '../../reducers';
import { ApprovalStatus } from '../common/types';
import { skippedAttachmentFile } from './constants';
import { ApproverOption, BkStatus, BulkImportCustom, TableRow, TableRowWithIdx } from './types';

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
export const getBulkImportsMap = (state: ApplicationState) => state.bulkImport.main.bulkImports.reduce((acc, importItem) => {
  acc[importItem.jobId] = importItem;
  return acc;
}, {});
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
    const progress = bulkImport?.process?.process
      ? bulkImport.process.process.filter(p => p.status === BkStatus.COMPLETED)
        .reduce((total, current) => total + (current.percentage * 100), 0) : 0;
    const approvalCheck = bulkImport?.documentRevision?.approvals?.some(approval => approval.status !== ApprovalStatus.Abandoned) ?? false;

    const icons = [
      {
        icon: bulkImport?.xlsx && bulkImport?.xlsx.length > 0 ? 'check' : 'blank',
        text: translate('bulkImport.uploadData'),
        step: 1,
      },
      { // we valid if the next step is already done "attachmentId" because process.step can be deleted on Bulk import process after the approve
        icon: bulkImport?.attachmentId || Number(bulkImport.process?.step) <= 3 ? 'check' : 'blank',
        text: translate('bulkImport.mapColumns'),
        step: 2,
      },
      {
        icon: bulkImport?.attachmentId || (bulkImport?.attachmentLink && bulkImport?.attachmentLink !== skippedAttachmentFile) ? 'check' : approvalCheck || bulkImport.attachmentLink === skippedAttachmentFile ? 'skip' : 'blank',
        text: translate('common.attachments'),
        step: 3,
      },
      {
        icon: approvalCheck && bulkImport?.status !== BkStatus.CANCELLED ? 'check' : 'blank',
        text: translate('bulkImport.approvals'),
        step: 4,
      },
      {
        icon: !isEmpty(bulkImport.process?.process) && progress > 99 && bulkImport?.status !== BkStatus.CANCELLED ? 'check' : 'blank',
        text: translate('bulkImport.importing'),
        step: 5,
      },
    ];
    const bulkImportWithCustom: BulkImportCustom = {
      ...bulkImport,
      progress: progress,
      icons,
    };
    // Apply filters before adding to accumulator
    if ((!filterDataType || processType === filterDataType) && (!filterStatus || status === filterStatus)) {
      acc[status] = [...(acc[status] ?? []), bulkImportWithCustom];
    }
    return acc;
  }, {});
};
export const getBulkImportsGroupByProcessType = (state: ApplicationState): Record<string, BulkImportCustom[]> => {
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
    // Apply filters before adding to accumulator
    if ((!filterDataType || processType === filterDataType) && (!filterStatus || status === filterStatus)) {
      acc[processType] = [...(acc[processType] ?? []), bulkImport];
    }
    return acc;
  }, {});
};
export const getIsLoadingMain = (state: ApplicationState) => state.bulkImport.main.isLoading;
