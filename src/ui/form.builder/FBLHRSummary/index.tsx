import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import {
  ColumnDefinition,
  DataGridProps,
} from '../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../components/notifications';
import { FBSection } from '../../form.builder';
import useAsync from '../../hooks/useAsync';
import { DATA_ITEM_KEY, SampleLHRSummaryData, SELECTED_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import {
  EditableLHRSummaryItem,
  EditableLHRSummaryItemEditEvent,
  LHRSummaryItem,
} from './types';

interface props {
  isShowOnly?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBLHRSummary: React.FunctionComponent<props> = ({
  isShowOnly,
  setDoNotPrompt,
}) => {
  const classes = useStyles();
  const [editedLHRSummaryItem, setEditedLHRSummaryItem]
    = React.useState<EditableLHRSummaryItem>();
  const [data, setData] = React.useState<EditableLHRSummaryItem[]>(SampleLHRSummaryData);

  const materialDispositionAsync = useAsync({
    onSuccess: (data: {
      records: EditableLHRSummaryItem[]
      lastRefreshedAt: Date
    }) => {
      setData(data?.records ?? []);
    },
    onError: toastError,
  });

  const partAsync = useAsync({
    onSuccess: () => {
      // TODO
    },
    onError: toastError,
  });

  const formik = useFormik<Partial<EditableLHRSummaryItem>>({
    initialValues: {},
    onSubmit: (values) => {
      // TODO save & update cases
      updateMaterialDispositionTableData([values] as EditableLHRSummaryItem[]);
      ondiscardLHRSummaryItem();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  const updateMaterialDispositionTableData = (
    data: EditableLHRSummaryItem[],
  ) => {
    const partToSave = {
      materialDispositionEntryUpdates: data.map((dataItem) => ({
        materialDispositionId: dataItem.id,
        ...dataItem,
      })),
    };
    // TODO
    console.log(partToSave);
  };

  useEffect(() => {
    resetForm({ values: editedLHRSummaryItem ?? {} });
  }, [editedLHRSummaryItem, setValues, resetForm]);

  useEffect(() => {
    fetchMaterialDispositionTableData();
  }, []);

  const fetchMaterialDispositionTableData = () => {
    // TODO later
  };

  const onEditLHRSummaryItem = ({
    dataItem,
  }: EditableLHRSummaryItemEditEvent) => {
    if (isShowOnly || formik.dirty) {
      return;
    }
    setEditedLHRSummaryItem(dataItem);
  };

  const ondiscardLHRSummaryItem = () => {
    setEditedLHRSummaryItem(undefined);
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
      lotId: '',
      equipmentId: '',
      mpiId: '',
      expiryDate: '',
      startQuantity: 0,
      endQuantity: 0,
      status: '',
      calDueDate: '',
      pmDueDate: '',
      ncmr: '',
      comments: '',
      createdBy: '',
      createdAt: '',
      [MODE_FIELD]: Mode.add,
    };
    console.log('newLHRSummaryItem :', newLHRSummaryItem);
    setEditedLHRSummaryItem(newLHRSummaryItem);
  };

  const rowRender: DataGridProps<LHRSummaryItem>['rowRender'] = (
    row,
    { dataItem },
  ) => {
    const item = dataItem as LHRSummaryItem;
    const isUpdating = [Mode.edit].includes(item[MODE_FIELD]);

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
        {
          ...(isLHRSummaryItemEdited ? editedLHRSummaryItem : item),
          [MODE_FIELD]: isLHRSummaryItemEdited ? Mode.edit : Mode.show,
        },
        ...list,
      ];
    }, isAlternatePartAdded ? [editedLHRSummaryItem] : [],
  );

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: onEditLHRSummaryItem,
    onConfirm: submitForm,
    onDiscard: ondiscardLHRSummaryItem,
  });

  const [columns]
    = React.useState<Array<ColumnDefinition<EditableLHRSummaryItem>>>(schema);

  return (
    <>
      <FBSection
        label={translate('lhr.summary.table.title')}
        data-cy="lhr-summary-title"
      >
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
      </FBSection>
      <KendoDataGrid<EditableLHRSummaryItem>
        data={LHRSummaryItemList}
        schema={getColumns()}
        fullWidth
        className={classes.rootLHRSummaryTable}
        hasBoxScrollbars
        onRowClick={onEditLHRSummaryItem}
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
        loading={materialDispositionAsync.isLoading || partAsync.isLoading}
        resizable={true}
      />
      {!isShowOnly && (
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
