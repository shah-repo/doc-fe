import { Box, Tooltip, Typography } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { CompositeFilterDescriptor, filterBy, process, State } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { GridCellProps, GridColumn, GridDataStateChangeEvent, GridFilterChangeEvent, GridPageChangeEvent } from '@progress/kendo-react-grid';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { noop } from 'lodash';
import React, { ComponentType, ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { validateDateFormats } from '../../../../common/utils/date';
import { patchBulkImport, setDataTable, setIsLoading, setOnlyErrorsTable, setShowTable, setUnsavedChanges, updateRowFieldTable } from '../../../../state/ducks/bulkImport/actions';
import { getHasUnsavedChanges, getIsLoading, getShowErrorsOnly, getTableDataFiltered } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImport, TableErrorDetail, TableErrorValidation, TableRowWithIdx } from '../../../../state/ducks/bulkImport/types';
import StyledKendoGrid from '../../../components/StyledKendoGrid/StyledKendoGrid';
import Text from '../../../components/Text';
import Loader from '../../../components/common/kendo/Loader';
import { AlertDialog } from '../../../components/dialogs';
import { Button, Switch } from '../../../components/forms/fields-next';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import MessageInformation from '../MessageInformation';
import StepTitle from '../StepTitle';
import useStyles from './styles';
import { getBaseDocId, isValidBaseDocIdPart } from './validation';

interface CheckValuesTableProps {
  children?: ReactNode
  bulkImport?: BulkImport
  handleNext: () => void
  handleBack: () => void
  handleCancel: () => void
}

interface CustomDataItem {
  [key: string]: string | string[] | number | TableErrorDetail[] | undefined
  errors?: TableErrorDetail[]
}

interface CustomCellProps extends GridCellProps {
  dataItem: CustomDataItem
  field: string
}

const CustomCell: React.FC<CustomCellProps> = ({ dataItem, field, ...props }): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(dataItem[field]);
  const error = dataItem.errors?.find(error => error.column === field);
  const isErrorShown = error && !error?.edited;

  const handleErrorField = () => {
    setIsEditing(true);
  };

  const handleChange = (e: InputChangeEvent) => {
    setCellValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const valueCheck = cellValue as string;
    let isValid = true;

    if (error?.help?.validate === TableErrorValidation.DOC_ID && error?.help?.data?.length) {
      const docId = valueCheck?.split('.')[0];
      const baseDocId = getBaseDocId(docId, error?.help?.data);
      isValid = baseDocId?.length > 0;

      if (isValid) {
        isValid = isValidBaseDocIdPart(docId, baseDocId);
      }
    } else {
      // validate if the value is the same as requiered or if have - star with the value
      if (error?.help?.data?.length) {
        isValid = error?.help?.data.some(entry => entry === valueCheck);
      }

      // At the moment format is only for dates
      if (isValid && error?.help?.format?.length) {
        const dateFormats = error?.help?.format.map(fmt => fmt.replace(/Y/g, '\\d').replace(/M|D/g, '\\d'));
        const datePattern = new RegExp(`^(${dateFormats.join('|')})$`);
        isValid = datePattern.test(valueCheck);

        if (isValid) {
          isValid = validateDateFormats(valueCheck, error?.help?.format);
        }
      }
    }

    dispatch(updateRowFieldTable({ cellValue: valueCheck, field, dataIndex: dataItem.idx as number, isEdited: isValid }));
  };

  const content = (
    <Box className={cx(classes.cell, { [classes.errorCell]: isErrorShown })}>
      {cellValue}
      {isErrorShown && (
        <Tooltip
          title={
            <span className={classes.tooltipContent}>
              {error.message}
              {error?.help?.message && (
                <>
                  <br />
                  {error.help.message}
                  {error?.help?.data?.length && (
                    <>
                      : {error.help.data.join(', ')}
                    </>
                  )}
                </>
              )}
            </span>
          }
          placement="top"
        >
          <ReportProblemOutlinedIcon className={classes.warningIcon} />
        </Tooltip>
      )}
    </Box>
  );

  return (
    <td
      colSpan={props?.colSpan}
      style={props?.style}
      role="gridcell"
      className={props?.className}
      onClick={error ? handleErrorField : undefined}
    >
      {isEditing ? (
        <Input value={cellValue as string} onChange={handleChange} onBlur={handleBlur} autoFocus />
      ) : content}
    </td>
  );
};

// Create an array of mock data items
const PAGE_SIZES = [12, 24, 50, 100];
const BUTTON_COUNT = 4;

const CheckValuesTable: React.FC<CheckValuesTableProps> = ({ handleNext, handleBack, handleCancel, bulkImport }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const openLeaveDialog = useDialog();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: pageSize,
    sort: [],
  });
  const [data, setData] = useState<TableRowWithIdx[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const tableData: TableRowWithIdx[] = useSelector(getTableDataFiltered);
  const showErrorsOnly = useSelector(getShowErrorsOnly);
  const uploadFileDataAction = useActionCreator(setDataTable);
  const triggerNextClick = useActionCreator(patchBulkImport);
  const excelExportRef = useRef<ExcelExport | null>(null);
  const currentDestination = useRef<string | null>(null);
  const [filter, setFilter] = useState<CompositeFilterDescriptor>();
  const isLoading = useSelector(getIsLoading);
  const hasUnsavedChanges = useSelector(getHasUnsavedChanges);

  const dataStateChange = (event: GridDataStateChangeEvent) => {
    setDataState(event.dataState);
    const processedData = process(tableData, event.dataState);
    setData(processedData.data);
  };

  const filterChange = (event: GridFilterChangeEvent) => {
    const newData: TableRowWithIdx[] = filterBy(tableData, event.filter);
    setFilter(event.filter);
    setData(newData.slice(page * pageSize, (page + 1) * pageSize));
  };

  const exportToExcel = () => {
    if (!excelExportRef.current) {
      return;
    }

    // Retrieve the current workbook options
    const options = excelExportRef.current.workbookOptions();

    // Modify the sheet name
    if (options.sheets && options.sheets.length > 0) {
      options.sheets[0].name = bulkImport?.processType;
    }

    // Save the Excel file with the modified options
    excelExportRef.current.save(options);
  };

  const asyncNextClick = useAsync({
    onSuccess: () => {
      dispatch(setShowTable(false));
      handleNext();
    },
  });

  const asyncSetDataTable = useAsync({
    onSuccess: () => {
      asyncNextClick.start(triggerNextClick, { bulkImportId: bulkImport?.id, data: { process: { step: 3 } } }, asyncNextClick);
    },
  });

  const handlePrevious = () => {
    if (hasUnsavedChanges) {
      currentDestination.current = null;
      openLeaveDialog.open();
      return;
    }
    handleBack();
  };

  const asyncSaveDataTable = useAsync();

  const handleSaveChanges = () => {
    dispatch(setUnsavedChanges(false));
    asyncSaveDataTable.start(uploadFileDataAction, { data: tableData, bulkImportId: bulkImport?.id }, asyncSaveDataTable);
  };

  const handleCloseLeaveDialog = () => {
    currentDestination.current = null; // Reset destination if user cancels
    openLeaveDialog.close();
  };

  const handleOpenLeaveDialog = () => {
    if (currentDestination.current) {
      history.push(currentDestination.current); // Navigate to saved destination
    } else { // if currentDestination.current is null is because is a goBack
      handleBack();
    }
    openLeaveDialog.close();
    dispatch(setUnsavedChanges(false));
  };

  const confirmLeavePage = (event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      event.preventDefault();
    }
  };

  const handlePageChange = (event: GridPageChangeEvent) => {
    setPage(event.page.skip / event.page.take);
    setPageSize(event.page.take);
    setData(tableData.slice(event.page.skip, event.page.skip + event.page.take));
  };

  const triggerNext = () => {
    dispatch(setUnsavedChanges(false));
    dispatch(setIsLoading(true));
    asyncSetDataTable.start(uploadFileDataAction, { data: tableData, bulkImportId: bulkImport?.id }, asyncSetDataTable);
  };

  const updateShowErrorOnly = () => dispatch(setOnlyErrorsTable(!showErrorsOnly));

  useEffect(() => {
    window.addEventListener('beforeunload', confirmLeavePage);

    return () => {
      window.removeEventListener('beforeunload', confirmLeavePage);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const unblock = history.block((nextLocation) => {
      if (hasUnsavedChanges && !currentDestination.current) {
        currentDestination.current = nextLocation.pathname;
        openLeaveDialog.open();
        return false; // Block the navigation
      }
      return true; // Allow the navigation
    });

    return () => unblock(); // Clean up listener on component unmount
  }, [history, hasUnsavedChanges, openLeaveDialog]);

  useEffect(() => {
    setData(tableData.slice(page, pageSize));
    const count = tableData.reduce((acc, item) => {
      // Check if item has errors and it's an array
      if (Array.isArray(item.errors)) {
        // Filter errors that are not edited and count them
        const uneditedErrors = item.errors.filter(error => !error.edited).length;
        return acc + uneditedErrors;
      }
      return acc;
    }, 0);
    setErrorCount(count);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const tableHeadersFiltered = tableData.length > 0 ? Object.keys(tableData[0]).filter(key => key !== 'errors' && key !== 'idx') : [];

  return (
    <>
      <StepTitle title="bulkImport.mapColumns.table.title" subTitle="bulkImport.mapColumns.table.subTitle" />
      <Box className={classes.informationHeader}>
        <MessageInformation showError={errorCount > 0} message={errorCount > 0 ? `${errorCount} ${translate('common.table.rowsErrors')}` : translate('common.table.noRowsErrors')} />
        <Box className={classes.actionsHeader}>
          <Switch checked={showErrorsOnly && errorCount !== 0} onChange={updateShowErrorOnly} disabled={errorCount === 0} />
          <Typography className={classes.switchLabel}><Text translation="common.table.onlyShowRowsErrors" /></Typography>
          <Button
            onClick={noop}
            className={classes.button}
            disabled
          >
            <Text translation="common.template.reUpload" />
          </Button>
        </Box>
      </Box>
      {isLoading && <Loader />}
      { !isLoading
        && <ExcelExport
          data={tableData}
          ref={excelExportRef}
          fileName={`${bulkImport?.processType || 'export'}.xlsx`}
        >
          <StyledKendoGrid
            data={data}
            {...dataState}
            skip={page * pageSize}
            take={pageSize}
            total={tableData.length}
            editField="inEdit"
            pageable={{
              buttonCount: BUTTON_COUNT,
              pageSizes: PAGE_SIZES,
            }}
            sortable
            resizable
            reorderable
            filterable
            filter={filter}
            onPageChange={handlePageChange}
            onDataStateChange={dataStateChange}
            onFilterChange={filterChange}
          >
            {tableHeadersFiltered.map((key, idx) => (
              <GridColumn width={150} filter="text" key={idx} field={key} title={key} cell={CustomCell as ComponentType<GridCellProps>} />
            ))}
          </StyledKendoGrid>
        </ExcelExport>
      }
      <Box className={classes.actionsContainer}>
        <Button
          kind="secondary"
          className={classes.buttonsCancel}
          onClick={handleCancel}
        >
          <Text translation="bulkImport.delete" />
        </Button>
        <Box className={classes.buttonsFooterContainer}>
          <Button
            onClick={exportToExcel}
            className={classes.button}
          >
            <Text translation="common.export.xls" />
          </Button>
          <Button
            onClick={handlePrevious}
            kind="outlined"
            className={classes.button}
          >
            <Text translation="common.previous" />
          </Button>
          <Button
            onClick={handleSaveChanges}
            className={classes.button}
            disabled={!hasUnsavedChanges}
          >
            <Text translation="common.save.changes" />
          </Button>
          <Button
            onClick={triggerNext}
            className={classes.button}
            disabled={tableData.length === 0}
          >
            <Text translation="common.next" />
          </Button>
        </Box>
      </Box>
      <AlertDialog
        handler={openLeaveDialog}
        cancelLabel="common.no.go.back"
        onConfirm={handleOpenLeaveDialog}
        onCancel={handleCloseLeaveDialog}
      >
        <p>{translate('bulkImport.unsavedChangesLeave')}</p>
      </AlertDialog>
    </>
  );
};

export default CheckValuesTable;
