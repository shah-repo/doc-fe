import { Box } from '@material-ui/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import {
  extendDataItem,
  filterBy,
  mapTree,
  orderBy,
  TreeList,
  TreeListCellProps,
  TreeListDataStateChangeEvent,
} from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { useFormik } from 'formik';
import { isEmpty, replace, uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import DocumentRevisionDialog from '../../../components/common/dialogs/DocumentRevisionDialog';
import { Button } from '../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { FB } from '../../helpers';
import { ADD_FIELD, DATA_ITEM_KEY, EXPAND_FIELD, SUB_ITEMS_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import {
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  EditableMaterial,
  Material,
  MaterialItemState,
  MaterialTableProps,
} from './types';
import { useOptions } from './useOptions';

const MaterialsTable: React.FC<MaterialTableProps> = ({ isActive }) => {
  const classes = useStyles();
  const [editedMaterial, setEditedScanLot] = useState<Partial<EditableMaterial>>();
  // const isMaterialEdited = editedMaterial?.[MODE_FIELD] === Mode.add;
  const editScanLot = ({ dataItem }) => setEditedScanLot(dataItem);
  const { units, parts } = useOptions();
  const isInEditMode = editedMaterial !== undefined;
  const handleRowClick = !isInEditMode ? editScanLot : undefined;
  const [selectedDataItem, setSelectedDataItem] = useState<EditableMaterial>();
  const quickViewDialog = useDialog();
  const [state, setState] = React.useState<MaterialItemState>({
    data: [],
    expanded: [],
    dataState: {
      sort: [],
      filter: [],
    },
    inEdit: [],
  });

  const updateState = (stateInfo) => {
    setState(stateInfo);
  };

  const handleExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : uniq([...state.expanded, event.dataItem.id]);

    updateState({
      ...state,
      expanded,
    });
  };

  const formik = useFormik<Partial<EditableMaterial>>({
    initialValues: {},
    onSubmit: (values) => {
      // const scanLot = omit(values, FIELDS_TO_OMIT);
      // updateMaterial?.(scanLot as Material);
      discardScanLot();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedMaterial ?? {} });
  }, [editedMaterial, setValues, resetForm]);

  const discardScanLot = (dataItem?: EditableMaterial) => {
    if (dataItem?.[ADD_FIELD]) {
      if (dataItem.isLotAddition) {
        // const parentIndex = state?.data?.findIndex(data => { return data.partRevId === dataItem.parentPartRevId; });
        // if (parentIndex !== -1) {
        //   state.data[parentIndex][SUB_ITEMS_FIELD] = state.data[parentIndex][SUB_ITEMS_FIELD]?.filter(
        //     (data) => !data[ADD_FIELD],
        //   );
        // }
      } else {
        state.data = state.data?.filter(
          (data) => !data[ADD_FIELD],
        );
      }
    }

    setState(prevState => ({
      ...prevState,
      inEdit: [],
      data: [...state.data],
    }));
   formik?.resetForm();
  };

  const removeScanLot = (material: EditableMaterial) => {
    // deleteMaterial(material);
    discardScanLot();
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableMaterial) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableMaterial;
    // const parentChildRelkey = item.parentPartRevId ? `alloc-row-${item?.lotDocId}` : `alloc-row-${item.partRevId}-${item?.docId}`;

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
      }),
    };

    const showWithoutActions = !item[MODE_FIELD];

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.id}`,
        // ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    return React.cloneElement(row, {
      ...modifiedProps,
      ['data-cy' as string]: `alloc-row-${item?.id}`,
      // ['data-parent-rel' as string]: parentChildRelkey,
      className: cx(row.props.className, classes.updatingRow),
    });
  };

  console.log('units', units);
  const schema = buildSchema({
    units,
    parts,
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
    onOpenQuickView: openQuickView,
    onEdit: setEditedScanLot,
  });

  const treeData: Material[] = [
    {
      id: '1',
      unit: 'hours',
      actualId: '',
      plannedId: 'b5c9ab44-653e-4d31-843b-c67276a9395f',
      quantity: 12,
      items: [
        {
          id: '2',
          unit: 'Box(s)',
          plannedId: '',
          actualId: 'b5c9ab44-653e-4d31-843b-c67276a9395f',
          lotId: 'e7949809-b5e2-4a44-a6f0-2594424c127b',
          quantity: 14,
        },
      ],
    },
  ];

  useEffect(() => {
    setState({ ...state, data: treeData });
  }, []);

  const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
    updateState({
      ...state,
      dataState: event.dataState,
    });
  };

  const addExpandField = (dataTree: Material[]) => {
    const { expanded, inEdit } = state;
    return mapTree(dataTree, SUB_ITEMS_FIELD, (item) =>
      extendDataItem(item, SUB_ITEMS_FIELD, {
        [EXPAND_FIELD]: expanded.includes(item.id),
        [MODE_FIELD]: Boolean(inEdit.find((i) => i.id === item.id)),
      }),
    );
  };

  const processData = () => {
    const { data, dataState } = state;
    if (!dataState) {
      state.dataState = {
        sort: [],
        filter: [],
      };
      return [];
    }

    const filter = [...(dataState.filter as FilterDescriptor[])];
    const filteredData = dataState.filter && filterBy(data, filter, SUB_ITEMS_FIELD);
    const sortedData = dataState.sort && filteredData && orderBy(filteredData, dataState?.sort, SUB_ITEMS_FIELD);

    return addExpandField(sortedData as Material[]);
  };

  const cellRender = (
    tdElement: React.ReactElement<HTMLTableCellElement, string | React.JSXElementConstructor<any>> | null,
    cellProps: TreeListCellProps,
  ): React.ReactElement<HTMLTableCellElement> => {
    const props = {
      ...tdElement?.props,
      className: cx(tdElement?.props.className, classes.borderBottom),
    };
    const defaultRendering = { ...tdElement, props: props };
    return defaultRendering as React.ReactElement<HTMLTableCellElement>;
  };

  const createPartItem = (): EditableMaterial => {
    return {
      id: FB.uniqid,
      plannedId: '',
      actualId: '',
      unit: '',
      quantity: undefined,
      isLotAddition: false,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const addPartItem = () => {
    const newMaterialItem = createPartItem();
    const isAddMaterialExists = state.data?.findIndex((data) => data[ADD_FIELD]);
    if (isAddMaterialExists === -1) {
      state.data.push(newMaterialItem);
      setState((prevState) => ({
        ...prevState,
        data: [...state.data],
        inEdit: [newMaterialItem],
      }));
      formik.setValues(newMaterialItem);
    }
  };

  return (
    <Box className={classes.root} data-cy="material-grid">
      <TreeList
        tableProps={{ style: { tableLayout: 'fixed' } }}
        className={cx(classes.treeList, 'containing-box-scrollbar')}
        {...state.dataState}
        data={processData()}
        dataItemKey={DATA_ITEM_KEY}
        subItemsField={SUB_ITEMS_FIELD}
        expandField={EXPAND_FIELD}
        rowHeight={50}
        onExpandChange={handleExpandChange}
        onDataStateChange={handleDataStateChange}
        rowRender={rowRender}
        cellRender={cellRender}
        columns={schema}
      />
      {isActive && (
        <Button kind="add" fullWidth attached disabled={isInEditMode} onClick={addPartItem} data-cy="add-material">
          {translate('form.builder.procedure.material.table.add.part')}
        </Button>
      )}
      <DocumentRevisionDialog
        dialog={quickViewDialog}
        {...{
          docRevId: selectedDataItem?.lotNumber?.id,
        }}
      />
    </Box>
  );
};

export default React.memo(withThemeNext(MaterialsTable));
