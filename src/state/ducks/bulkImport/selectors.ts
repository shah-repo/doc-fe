import { flatMap } from 'lodash';
import { SelectOption } from '../../../ui/components/forms/fields/Select';
import { ApplicationState } from '../../reducers';
import { ApproverOption, BulkImportCustom } from './types';

// STEPS
const getStep = (state: ApplicationState) => state.bulkImport.steps.step;
const getDataType = (state: ApplicationState) => flatMap(state.bulkImport.steps.dataType);
const getDataTypeList = (state: ApplicationState) => flatMap(state.bulkImport.steps.dataTypeList);
const getDataTypeSelectList = (state: ApplicationState): SelectOption[] => {
  const dataTypeListObject = state.bulkImport.steps.dataTypeList;

  // Check if dataTypeListObject is not empty
  if (dataTypeListObject && Object.keys(dataTypeListObject).length > 0) {
    // Convert the object into an array of SelectOption objects
    const selectOptions: SelectOption[] = Object.entries(dataTypeListObject).map(([value, text]) => ({
      value,
      text,
    }));

    return selectOptions;
  }

  return [];
};
const getFormDocumentsTypeGroupList = (state: ApplicationState) => flatMap(state.bulkImport.steps.formDocumentsTypeGroupList);
const getFormDocumentsTypeGroupSelectList = (state: ApplicationState): SelectOption[] =>
  state.bulkImport.steps.formDocumentsTypeGroupList.map((docTypeGroup) => ({
    value: docTypeGroup.id,
    text: `${docTypeGroup?.document?.docId}${docTypeGroup.displayRevision && '.'}${docTypeGroup.displayRevision} - ${docTypeGroup.name}`,
  }));
const getBulkImport = (state: ApplicationState) => state.bulkImport.steps.bulkImport;
const getTemplateFile = (state: ApplicationState) => state.bulkImport.steps.templateFile;
const getXlsxFile = (state: ApplicationState) => state.bulkImport.steps.xlsx;
const getShowTable = (state: ApplicationState) => state.bulkImport.steps.showTable;
const getHeaders = (state: ApplicationState) => state.bulkImport.steps.headers;
const getTableData = (state: ApplicationState) => state.bulkImport.steps.tableData;
const getShowErrorsOnly = (state: ApplicationState) => state.bulkImport.steps.showErrorsOnly;
const getTableDataFiltered = (state: ApplicationState) => {
  const showErrorsOnly = state.bulkImport.steps.showErrorsOnly;
  const tableData = state.bulkImport.steps.tableData;

  if (showErrorsOnly) {
    return tableData.filter((item) => item.errors && item.errors.length > 0);
  }

  return tableData || [];
};
const getIsLoading = (state: ApplicationState) => state.bulkImport.steps.isLoading;
const getApproversData = (state: ApplicationState) => state.bulkImport.steps.approvers;
const getApproversSelectList = (state: ApplicationState): ApproverOption[] =>
  state.bulkImport.steps.approvers.map((approver) => ({
    value: approver?.id,
    text: approver?.user?.name,
    email: approver?.user?.email,
    avatar: approver?.user?.avatar,
  }));
// MAIN
const getBulkImports = (state: ApplicationState) => state.bulkImport.main.bulkImports;
const getBulkImportsGroupByProcess = (state: ApplicationState): Record<string, BulkImportCustom[]> => {
  const filterDataType = state.bulkImport.main.selectedDataType;
  const filterStatus = state.bulkImport.main.selectedStatus;
  return state.bulkImport.main.bulkImports.reduce<Record<string, BulkImportCustom[]>>((acc, bulkImport) => {
    const processId = bulkImport.processId;
    const status = bulkImport.status;
    const progress = bulkImport?.bulkImportProcess?.process
      ? bulkImport.bulkImportProcess.process.filter(p => p.status === 'COMPLETED')
        .reduce((total, current) => total + (current.percentage * 100), 0) : 0;
    const icons = [
      {
        icon: bulkImport?.xlsx && bulkImport?.xlsx.length > 0 ? 'check' : 'blank',
        text: 'Upload Data',
        step: 1,
      },
      {
        icon: bulkImport?.dataId ? 'check' : 'blank',
        text: 'Map Columns',
        step: 2,
      },
      {
        icon: bulkImport?.attachmentId ? 'check' : 'blank',
        text: 'Attachments',
        step: 3,
      },
      {
        icon: bulkImport?.documentRevision?.approvals && bulkImport?.documentRevision?.approvals.length > 0 ? 'check' : 'blank',
        text: 'Approvals',
        step: 4,
      },
    ];
    const bulkImportWithCustom: BulkImportCustom = {
      ...bulkImport,
      progress: progress,
      icons,
      button: true,
    };
    // Apply filters before adding to accumulator
    if ((!filterDataType || processId === filterDataType) && (!filterStatus || status === filterStatus)) {
      if (!acc[processId]) {
        acc[processId] = [];
      }
      acc[processId].push(bulkImportWithCustom);
    }
    return acc;
  }, {});
};
const getIsLoadingMain = (state: ApplicationState) => state.bulkImport.main.isLoading;

export default {
  getStep,
  getDataType,
  getDataTypeList,
  getDataTypeSelectList,
  getFormDocumentsTypeGroupList,
  getFormDocumentsTypeGroupSelectList,
  getBulkImport,
  getBulkImports,
  getBulkImportsGroupByProcess,
  getTemplateFile,
  getXlsxFile,
  getShowTable,
  getHeaders,
  getIsLoading,
  getIsLoadingMain,
  getTableData,
  getShowErrorsOnly,
  getTableDataFiltered,
  getApproversData,
  getApproversSelectList,
};
