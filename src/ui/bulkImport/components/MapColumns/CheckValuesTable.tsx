import { Box, Tooltip, Typography } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { GridCellProps, GridColumn, GridPageChangeEvent } from '@progress/kendo-react-grid';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { noop } from 'lodash';
import React, { ComponentType, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { setDataTable, setIsLoading, setOnlyErrorsTable, setShowTable, updateRowFieldTable } from '../../../../state/ducks/bulkImport/actions';
import { getShowErrorsOnly, getTableDataFiltered } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImport, TableErrorDetail, TableRow } from '../../../../state/ducks/bulkImport/types';
import StyledKendoGrid from '../../../components/StyledKendoGrid/StyledKendoGrid';
import Text from '../../../components/Text';
import { Button, Switch } from '../../../components/forms/fields-next';
import { toastError } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { NeedHelpButton } from '../ButtonActions';
import MessageInformation from '../MessageInformation';
import StepTitle from '../StepTitle';
import useStyles from './styles';

interface CheckValuesTableProps {
  children?: ReactNode
  bulkImport?: BulkImport
  handleNext: () => void
  handleBack: () => void
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

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: InputChangeEvent) => {
    setCellValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    dispatch(updateRowFieldTable({ cellValue: cellValue as string, field, dataIndex: props.dataIndex }));
  };

  const content = (
    <Box className={cx(classes.cell, { [classes.errorCell]: isErrorShown })}>
      {cellValue}
      {isErrorShown && (
        <ReportProblemOutlinedIcon className={classes.warningIcon} />
      )}
    </Box>
  );

  return (
    <td
      colSpan={props?.colSpan}
      style={props?.style}
      role="gridcell"
      className={props?.className}
      onDoubleClick={error ? handleDoubleClick : undefined}
    >
      {isEditing ? (
        <Input value={cellValue as string} onChange={handleChange} onBlur={handleBlur} autoFocus />
      ) : (
        isErrorShown ? (
          <Tooltip
            title={
              <span className={classes.tooltipContent}>
                {error.message}
                {error?.help?.message && (
                  <>
                    {error.help.message}
                    {error?.help?.data?.length && (
                      <>
                        {translate('common.allowed')}: {error.help.data.join(', ')}
                      </>
                    )}
                  </>
                )}
              </span>
            }
            placement="top"
          >
            {content}
          </Tooltip>
        ) : (
          content
        )
      )}
    </td>
  );
};

// Create an array of mock data items
const PAGE_SIZES = [12, 24, 50, 100];
const BUTTON_COUNT = 4;

const CheckValuesTable: React.FC<CheckValuesTableProps> = ({ handleNext, handleBack, bulkImport }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [data, setData] = useState<TableRow[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const tableData = useSelector(getTableDataFiltered);
  const showErrorsOnly = useSelector(getShowErrorsOnly);
  const uploadFileDataAction = useActionCreator(setDataTable);

  const asyncSetDataTable = useAsync({
    onSuccess: () => {
      dispatch(setShowTable(false));
      handleNext();
    },
  });

  const handlePageChange = (event: GridPageChangeEvent) => {
    setPage(event.page.skip / event.page.take);
    setPageSize(event.page.take);
    setData(tableData.slice(event.page.skip, event.page.skip + event.page.take));
  };

  const triggerNext = () => {
    if (errorCount > 0) {
      const errorMessage = translate('bulkImport.tableErrorCountMessage', {
        error: errorCount > 1 ? `${errorCount} errors` : 'error',
      });
      toastError(errorMessage, { position: 'top-right' });
      return;
    }
    dispatch(setIsLoading(true));
    asyncSetDataTable.start(uploadFileDataAction, { data: tableData, bulkImportId: bulkImport?.id }, asyncSetDataTable);
  };

  const updateShowErrorOnly = () => dispatch(setOnlyErrorsTable(!showErrorsOnly));

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

  const tableDataFiltered = tableData.length > 0 ? Object.keys(tableData[0]).filter(key => key !== 'errors') : [];

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
      <StyledKendoGrid
        data={data}
        skip={page * pageSize}
        take={pageSize}
        total={tableData.length}
        editField="inEdit"
        pageable={{
          buttonCount: BUTTON_COUNT,
          pageSizes: PAGE_SIZES,
        }}
        onPageChange={handlePageChange}
      >
        {tableDataFiltered.map((key, idx) => (
          <GridColumn key={idx} field={key} title={key} cell={CustomCell as ComponentType<GridCellProps>} />
        ))}
      </StyledKendoGrid>
      <Box className={classes.actionsContainer}>
        <NeedHelpButton />
        <Box className={classes.buttonsFooterContainer}>
          <Button
            onClick={handleBack}
            kind="outlined"
            className={classes.button}
          >
            <Text translation="common.previous" />
          </Button>
          <Button
            onClick={triggerNext}
            className={classes.button}
          >
            <Text translation="common.next" />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CheckValuesTable;
