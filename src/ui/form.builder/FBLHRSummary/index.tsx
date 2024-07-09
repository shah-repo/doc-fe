import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Typography } from '@material-ui/core';
import { ExcelExport, ExcelExportColumnProps } from '@progress/kendo-react-excel-export';
import { GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { find, map, pick } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { SM } from '../../../App';
import { translate } from '../../../common/intl';
import { lhrSummaryActions } from '../../../state/ducks/LHRSummary';
import { changeRequestsSelectors } from '../../../state/ducks/changeRequest';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatusDisplay } from '../../../state/ducks/documentRevisions/types';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import {
  ColumnDefinition,
  DataGridProps,
} from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import ColumnShowHideMenu from '../../components/common/kendo/ColumnShowHideMenu';
import { KendoColumn } from '../../components/common/kendo/types';
import { Button } from '../../components/forms/fields-next';
import { toastError } from '../../components/notifications';
import { StyleTooltip } from '../../dashboard.new/line.items/common/StyleTooltip';
import { FBSection } from '../../form.builder';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from './components/cells/CustomColumnMenu';
import {
  COLUMN_LOCK_FIELDS,
  DATA_ITEM_KEY,
  EXCEL_FILE_NAME,
  FIELDS_TO_PICK,
  SELECTED_FIELD,
} from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import {
  CustomTreeListColumnProps,
  EditableLHRSummaryItem,
  EditableLHRSummaryItemEditEvent,
  LHRSummaryItem,
} from './types';
import { getExcelColumns, getExcelData, processData } from './utils';

interface props {
  isShowOnly?: boolean
  isDisabled?: boolean
}

const FBLHRSummary: React.FunctionComponent<props> = ({
  isShowOnly,
  isDisabled,
}) => {
  const { _documentRevisionFormState, _tabsState } = SM.useStores();
  const size = useObserver(() => _tabsState?.contentSize);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editedLHRSummaryItem, setEditedLHRSummaryItem]
    = React.useState<EditableLHRSummaryItem>();
  const [data, setData] = React.useState<EditableLHRSummaryItem[]>([]);
  const fetchLHRSummary = useActionCreator(lhrSummaryActions.fetchLHRSummary);
  const addLHRSummary = useActionCreator(lhrSummaryActions.addLHRSummary);
  const updateLHRSummary = useActionCreator(lhrSummaryActions.updateLHRSummary);
  const deleteLHRSummary = useActionCreator(lhrSummaryActions.deleteLHRSummary);
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const isVoided = Boolean(_documentRevisionFormState?.documentRevision?.displayStatus?.includes(DocumentRevisionStatusDisplay.Voided));

  if (isVoided) {
    return null;
  }

  const LHRSummaryAsync = useAsync({
    onSuccess: (data) => {
      data && setData(processData(data as EditableLHRSummaryItem[], availableUsers));
    },
    onError: toastError,
  });

  useEffect(() => {
    if (isShowOnly) {
      return;
    }

    fetchLHRSummaryData();
  }, []);

  const fetchLHRSummaryData = () => {
    const docRevId = _documentRevisionFormState?.documentRevision?.id;
    if (!docRevId) {
      return;
    }

    LHRSummaryAsync.start(fetchLHRSummary, docRevId, LHRSummaryAsync);
    dispatch(documentRevisionsActions.loadAudit(docRevId));
  };

  const addLHRSummaryAsync = useAsync({
    onSuccess: fetchLHRSummaryData,
    onError: toastError,
  });

  const updateLHRSummaryAsync = useAsync({
    onSuccess: (response) => {
      if (response) {
        fetchLHRSummaryData();
      }
    },
    onError: toastError,
  });

  const deleteLHRSummaryAsync = useAsync({
    onSuccess: () => {
      ondiscardLHRSummaryItem();
      fetchLHRSummaryData();
    },
    onError: toastError,
  });

  const formik = useFormik<Partial<EditableLHRSummaryItem>>({
    initialValues: {},
    onSubmit: (values) => {
      updateLHRSummaryTableData(values as EditableLHRSummaryItem);
      ondiscardLHRSummaryItem();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  const updateLHRSummaryTableData = (data: EditableLHRSummaryItem) => {
    const payload = {
      ...pick(data, FIELDS_TO_PICK),
      startQuantity: String(data.startQuantity),
      endQuantity: String(data.endQuantity),
      // stepOrMPI: `${data.step}/${data.mpiId}`,
      stepOrMPI: data.mpiId ? `${data.step}/${data.mpiId}` : data.step,
    };

    if (data[MODE_FIELD] === Mode.add) {
      addLHRSummaryAsync.start(addLHRSummary, {
        ...payload,
        lhrDocRevId: _documentRevisionFormState?.documentRevision?.id,
      }, addLHRSummaryAsync);
      return;
    }

    payload.actualId = data.prevActualDocId === data.actualId ? data.prevActualId : data.actualId;
    updateLHRSummaryAsync.start(updateLHRSummary, _documentRevisionFormState?.documentRevision?.id, data.id, payload, updateLHRSummaryAsync);
  };

  useEffect(() => {
    resetForm({ values: editedLHRSummaryItem ?? {} });
  }, [editedLHRSummaryItem, setValues, resetForm]);

  useEffect(() => {
    setColumns((prevColumns) => {
      return schema.map((column) => {
        const updatedColumn = find(prevColumns, { id: column.id });
        return { ...column, ...pick(updatedColumn, COLUMN_LOCK_FIELDS) };
      });
    });
  }, [editedLHRSummaryItem, formik.dirty]);

  const onEditLHRSummaryItem = ({
    dataItem,
  }: EditableLHRSummaryItemEditEvent) => {
    if (isShowOnly || isDisabled || formik.dirty) {
      return;
    }

    const { stepOrMPI } = dataItem;
    const step = stepOrMPI?.split('/')?.[0];
    const mpiId = stepOrMPI?.split('/')?.[1];

    setEditedLHRSummaryItem({
      ...dataItem,
      step,
      mpiId,
    });
  };

  const ondiscardLHRSummaryItem = () => {
    setEditedLHRSummaryItem(undefined);
  };

  const onDeleteLHRSummary = () => {
    if (!editedLHRSummaryItem?.id) {
      return;
    }

    deleteLHRSummaryAsync.start(deleteLHRSummary, _documentRevisionFormState?.documentRevision?.id, editedLHRSummaryItem?.id, deleteLHRSummaryAsync);
  };

  const getColumns = () => {
    return columns.filter(({ show }) => show);
  };

  const onAddItem = () => {
    const newLHRSummaryItem: EditableLHRSummaryItem = {
      id: uuidv4(),
      step: '',
      type: '',
      plannedId: '',
      actualId: '',
      title: '',
      lotOrEquipment: '',
      issue: '',
      equipmentId: '',
      mpiId: '',
      expiryDate: null,
      startQuantity: 0,
      endQuantity: 0,
      lotStatus: '',
      calDueDate: null,
      pmDueDate: null,
      ncmr: '',
      comments: '',
      enteredBy: '',
      recordCreationDate: new Date().toISOString(),
      [MODE_FIELD]: Mode.add,
    };

    setEditedLHRSummaryItem(newLHRSummaryItem);
  };

  const rowRender: DataGridProps<LHRSummaryItem>['rowRender'] = (
    row,
    { dataItem },
  ) => {
    const item = dataItem as LHRSummaryItem;
    const isUpdating = [Mode.edit, Mode.add].includes(item[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(row, {
      className: cx(row.props.className, classes.updatingRow),
    });

    return <FormikProvider value={formik}>{editedRow}</FormikProvider>;
  };

  const isAlternatePartAdded = editedLHRSummaryItem?.[MODE_FIELD] === Mode.add;

  const LHRSummaryItemList = data?.reduce<EditableLHRSummaryItem[]>(
    (list, item) => {
      const isLHRSummaryItemEdited
        = editedLHRSummaryItem && editedLHRSummaryItem?.id === item.id;

      return [
        ...list,
        {
          ...(isLHRSummaryItemEdited ? editedLHRSummaryItem : item),
          [MODE_FIELD]: isLHRSummaryItemEdited ? Mode.edit : Mode.show,
        },
      ];
    },
    isAlternatePartAdded ? [editedLHRSummaryItem] : [],
  );

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: onEditLHRSummaryItem,
    onConfirm: submitForm,
    onDiscard: ondiscardLHRSummaryItem,
    onDelete: onDeleteLHRSummary,
  });

  const [columns, setColumns]
    = React.useState<Array<ColumnDefinition<EditableLHRSummaryItem>>>(schema);

  const onLock = React.useCallback(
    ({ field, locked }: CustomTreeListColumnProps) => {
      const index = columns.findIndex((c) => c.field === field);
      const column = columns[index];

      if (column) {
        const newColumns = [...columns];
        newColumns.splice(index, 1, {
          ...column,
          locked: !locked,
          reorderable: locked,
          orderIndex: !locked ? 0 : undefined,
        });
        setColumns(newColumns);
      }
    },
    [columns],
  );

  const onColumnShowHide = ({ field }: KendoColumn) => {
    const dataColumns = map(columns, (column: ColumnDefinition<EditableLHRSummaryItem>) => {
      if (column.field === field) {
        column.show = !column.show;
      }

      return column;
    });
    setColumns(dataColumns);
  };

  const _export = React.useRef<ExcelExport | null>(null);
  const exportToExcel = () => {
    if (_export.current !== null) {
      _export.current.save(getExcelData(LHRSummaryItemList, availableUsers), getExcelColumns(getColumns()) as ExcelExportColumnProps[]);
    }
  };

  return (
    <>
      <FBSection
        label={translate('lhr.summary.table.title')}
        data-cy="lhr-summary-title"
      >
        {(!isShowOnly && !isDisabled) && (
          <Button
            kind="ghost"
            size="small"
            style={{ float: 'right' }}
            startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
            onClick={onAddItem}
            data-cy="lhr-summary-header-add-btn"
          >
            {translate('lhr.summary.add.item')}
          </Button>
        )}
      </FBSection>
      <ColumnMenuContext.Provider
        value={{
          columns: getColumns(),
          onLock,
        }}
      >
        <ExcelExport ref={_export} fileName={EXCEL_FILE_NAME}>
          <KendoDataGrid<EditableLHRSummaryItem>
            style={{ overflow: 'auto', maxHeight: size?.height ? `${size.height - 160}px` : '100px' }}
            data={LHRSummaryItemList}
            schema={getColumns()}
            fullWidth
            className={classes.rootLHRSummaryTable}
            hasBoxScrollbars
            onRowClick={onEditLHRSummaryItem}
            columnMenu={(props) => (
              <CustomColumnMenu
                {...props}
                columns={getColumns()}
                {...{
                  onLock,
                }}
              />
            )}
            selectedField={SELECTED_FIELD}
            dataItemKey={DATA_ITEM_KEY}
            filterable={true}
            navigatable={true}
            rowRender={rowRender}
            fallback={
              <Typography className={classes.font}>
                {translate('lhr.summary.table.empty.records')}
              </Typography>
            }
            loading={
              LHRSummaryAsync.isLoading
            || addLHRSummaryAsync.isLoading
            || deleteLHRSummaryAsync.isLoading
            || updateLHRSummaryAsync.isLoading
            }
            resizable={true}
          >
            <GridToolbar>
              <Grid container justify="flex-end"
                className={classes.toolbarContainer}
              >
                <Grid item >
                  <StyleTooltip
                    title={translate('common.download')}
                    placement="top"
                    arrow
                  >
                    <FontAwesomeIcon data-cy="excel-download"
                      className={classes.icon}
                      onClick={exportToExcel}
                      icon={solid('arrow-down-to-line')} />
                  </StyleTooltip>
                </Grid>
                <Grid item
                  data-cy="show-hide-columns"
                >
                  <ColumnShowHideMenu
                    columnDefinition={columns?.filter(data => data.id !== 'actions') as KendoColumn[]}
                    onChange={onColumnShowHide}
                  />
                </Grid>
              </Grid>
            </GridToolbar>
          </KendoDataGrid>
        </ExcelExport>
      </ColumnMenuContext.Provider>
      {(!isShowOnly && !isDisabled) && (
        <Button
          kind="add"
          fullWidth
          attached
          onClick={onAddItem}
          data-cy="lhr-summary-add-btn"
        >
          {translate('lhr.summary.add.item')}
        </Button>
      )}
    </>
  );
};

export default FBLHRSummary;
