import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { find, pick } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { SM } from '../../../App';
import { translate } from '../../../common/intl';
import { authSelectors } from '../../../state/ducks/auth';
import { lhrSummaryActions } from '../../../state/ducks/LHRSummary';
import { Button } from '../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import {
  ColumnDefinition,
  DataGridProps,
} from '../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../components/notifications';
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
  const [editedLHRSummaryItem, setEditedLHRSummaryItem]
    = React.useState<EditableLHRSummaryItem>();
  const [data, setData] = React.useState<EditableLHRSummaryItem[]>([]);
  const fetchLHRSummary = useActionCreator(lhrSummaryActions.fetchLHRSummary);
  const addLHRSummary = useActionCreator(lhrSummaryActions.addLHRSummary);
  const updateLHRSummary = useActionCreator(lhrSummaryActions.updateLHRSummary);
  const deleteLHRSummary = useActionCreator(lhrSummaryActions.deleteLHRSummary);

  const LHRSummaryAsync = useAsync({
    onSuccess: (data) => {
      data && setData(data as EditableLHRSummaryItem[]);
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
    if (!_documentRevisionFormState?.documentRevision?.id) {
      return;
    }

    LHRSummaryAsync.start(fetchLHRSummary, _documentRevisionFormState?.documentRevision?.id, LHRSummaryAsync);
  };

  const addLHRSummaryAsync = useAsync({
    onSuccess: fetchLHRSummaryData,
    onError: toastError,
  });

  const updateLHRSummaryAsync = useAsync({
    onSuccess: (response) => {
      if (response?.affected > 0) {
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
      stepOrMPI: `${data.step}/${data.mpiId}`,
      lhrDocRevId: _documentRevisionFormState?.documentRevision?.id,
    };

    if (data[MODE_FIELD] === Mode.add) {
      addLHRSummaryAsync.start(addLHRSummary, payload, addLHRSummaryAsync);
      return;
    }
    delete payload.lhrDocRevId;

    const actualId = data.prevActualDocId === data.actualId ? data.prevActualId : data.actualId;
    payload.actualId = actualId;
    updateLHRSummaryAsync.start(updateLHRSummary, _documentRevisionFormState?.documentRevision?.id, data.id, payload, updateLHRSummaryAsync);
  };

  useEffect(() => {
    setColumns((prevColumns) => {
      return schema.map((column) => {
        const updatedColumn = find(prevColumns, { id: column.id });
        return { ...column, ...pick(updatedColumn, COLUMN_LOCK_FIELDS) };
      });
    });

    resetForm({ values: editedLHRSummaryItem ?? {} });
  }, [editedLHRSummaryItem, setValues, resetForm]);

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

  const user = useSelector(authSelectors.currentUser);

  const onAddItem = () => {
    // TODO update as per edit fields
    const newLHRSummaryItem: EditableLHRSummaryItem = {
      id: uuidv4(),
      step: '',
      type: '',
      plannedId: '',
      actualId: '',
      title: '',
      lotOrEquipment: '',
      equipmentId: '',
      mpiId: '',
      expiryDate: null,
      startQuantity: 0,
      endQuantity: 0,
      status: '',
      calDueDate: null,
      pmDueDate: null,
      ncmr: '',
      comments: '',
      enteredBy: user.id,
      createdAt: new Date().toISOString(),
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
              {isShowOnly
                ? translate('table.no.results.found')
                : translate('lhr.summary.table.empty.records')}
            </Typography>
          }
          loading={
            LHRSummaryAsync.isLoading
            || addLHRSummaryAsync.isLoading
            || deleteLHRSummaryAsync.isLoading
            || updateLHRSummaryAsync.isLoading
          }
          resizable={true}
        />
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
