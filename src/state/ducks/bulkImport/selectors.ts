import { translate } from '../../../common/intl';
import { SelectOption } from '../../../ui/components/forms/fields/Select';
import { ApplicationState } from '../../reducers';
import { ApproverOption, BkStatus, BulkImportCustom } from './types';

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
  const tableData = state.bulkImport.steps.tableData;

  if (showErrorsOnly) {
    return tableData.filter((item) => item.errors && item.errors.length > 0);
  }

  return tableData || [];
};
export const getIsLoading = (state: ApplicationState) => state.bulkImport.steps.isLoading;
export const getApproversSelectList = (state: ApplicationState): ApproverOption[] =>
  state.bulkImport.steps.approvers.map((approver) => ({
    value: approver?.id,
    text: approver?.user?.name,
    email: approver?.user?.email,
    avatar: approver?.user?.avatar,
  }));
// MAIN
export const getBulkImports = (state: ApplicationState) => state.bulkImport.main.bulkImports;
export const getBulkImportsGroupByProcess = (state: ApplicationState): Record<string, BulkImportCustom[]> => {
  const filterDataType = state.bulkImport.main.selectedDataType;
  const filterStatus = state.bulkImport.main.selectedStatus;
  return state.bulkImport.main.bulkImports.reduce<Record<string, BulkImportCustom[]>>((acc, bulkImport) => {
    const processType = bulkImport.processType;
    const status = bulkImport.status;
    const progress = bulkImport?.process?.process
      ? bulkImport.process.process.filter(p => p.status === BkStatus.COMPLETED)
        .reduce((total, current) => total + (current.percentage * 100), 0) : 0;
    const icons = [
      {
        icon: bulkImport?.xlsx && bulkImport?.xlsx.length > 0 ? 'check' : 'blank',
        text: translate('bulkImport.uploadData'),
        step: 1,
      },
      {
        icon: bulkImport?.dataId ? 'check' : 'blank',
        text: translate('bulkImport.mapColumns'),
        step: 2,
      },
      {
        icon: bulkImport?.attachmentId ? 'check' : 'blank',
        text: translate('common.attachments'),
        step: 3,
      },
      {
        icon: bulkImport?.documentRevision?.approvals && bulkImport?.documentRevision?.approvals.length > 0 ? 'check' : 'blank',
        text: translate('bulkImport.approvals'),
        step: 4,
      },
    ];
    const bulkImportWithCustom: BulkImportCustom = {
      ...bulkImport,
      progress: progress,
      icons,
    };
    // Apply filters before adding to accumulator
    if ((!filterDataType || processType === filterDataType) && (!filterStatus || status === filterStatus)) {
      acc[processType] = [...(acc[processType] ?? []), bulkImportWithCustom];
    }
    return acc;
  }, {});
};
export const getIsLoadingMain = (state: ApplicationState) => state.bulkImport.main.isLoading;
