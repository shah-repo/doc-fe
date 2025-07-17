import { Box } from '@material-ui/core';
import { TreeList, TreeListExpandChangeEvent } from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { useFormik } from 'formik';
import { differenceBy, omit, replace, unionBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import DocumentRevisionDialog from '../../../components/common/dialogs/DocumentRevisionDialog';
import { Button } from '../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import useDialog from '../../../hooks/useDialog';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { CustomTreeListRowProps, EditableMaterial, Material, MaterialTableProps } from './types';
import { useOptions } from './utils';

const MaterialsTable: React.FC<MaterialTableProps> = ({ isActive }) => {
  const classes = useStyles();
  const [editedMaterial, setEditedScanLot] = useState<Partial<EditableMaterial>>();
  const [materials, setMaterials] = useState<Material[]>();
  // const isMaterialEdited = editedMaterial?.[MODE_FIELD] === Mode.add;
  const editScanLot = ({ dataItem }) => setEditedScanLot(dataItem);
  const { units } = useOptions();
  const isInEditMode = editedMaterial !== undefined;
  const handleRowClick = !isInEditMode ? editScanLot : undefined;
  const [selectedDataItem, setSelectedDataItem] = useState<EditableMaterial>();
  const quickViewDialog = useDialog();

  const formik = useFormik<Partial<EditableMaterial>>({
    initialValues: {},
    onSubmit: (values) => {
      const scanLot = omit(values, FIELDS_TO_OMIT);
      updateMaterial?.(scanLot as Material);
      discardScanLot();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedMaterial ?? {} });
  }, [editedMaterial, setValues, resetForm]);

  const discardScanLot = () => setEditedScanLot(undefined);

  const removeScanLot = (material: EditableMaterial) => {
    deleteMaterial(material);
    discardScanLot();
  };

  const updateState = (materials: Material[]) => {
    setMaterials(materials);
  };

  const deleteMaterial = (item: Material) => {
    const filteredMaterial = differenceBy(materials, [item], 'id');
    updateState(filteredMaterial);
  };

  const updateMaterial = (item: Material) => {
    const updatedVendors = unionBy([{ ...item }], materials, 'id');
    updateState(updatedVendors);
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableMaterial) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  // const rowRender: DataGridProps<EditableMaterial>['rowRender'] = (row, { dataItem }) => {
  //   const item = dataItem as EditableMaterial;
  //   const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
  //   if (!isUpdating) {
  //     return row;
  //   }

  //   const editedRow = React.cloneElement(row, {
  //     className: cx(row.props.className, classes.updatingRow),
  //   });

  //   return <FormikProvider value={formik}>{editedRow}</FormikProvider>;
  // };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem;
    // const parentChildRelkey = item.parentPartRevId ? `alloc-row-${item?.lotDocId}` : `alloc-row-${item.partRevId}-${item?.docId}`;

    const modifiedProps = {
      className: replace(row?.props?.className, 'k-alt', ''),
    };

    const showWithoutActions = !item[MODE_FIELD];

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `material-${item?.id}`,
      });
    }

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.id}`,
        className: cx(row.props.className, classes.updatingRow),
      },
    );
  };

  const schema = buildSchema({
    units,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
    onOpenQuickView: openQuickView,
    onEdit: setEditedScanLot,
  });

  // const materialList = materials?.reduce(
  //   (list, item) => {
  //     const isMaterialEdited = editedMaterial && editedMaterial.id === item.id;

  //     return [
  //       ...list,
  //       {
  //         ...(isMaterialEdited ? editedMaterial : item),
  //         [MODE_FIELD]: isMaterialEdited ? Mode.edit : Mode.show,
  //       },
  //     ];
  //   },
  //   isMaterialEdited ? [editedMaterial] : [],
  // );

  // [
  //               {
  //                   "id": "md434vsf",
  //                   "unit": "hours",
  //                   "title": "b5c9ab44-653e-4d31-843b-c67276a9395f",
  //                   "partLot": "e7949809-b5e2-4a44-a6f0-2594424c127b",
  //                   "quantity": 12
  //               },
  //               {
  //                   "id": "md43494c",
  //                   "unit": "hours",
  //                   "title": "c5da3376-be66-45b5-811a-ee1c7ba2aedc",
  //                   "quantity": 13
  //               }
  //           ]

  const treeData: Material[] = [
    {
      id: '1',
      unit: 'hours',
      actualId: 'b5c9ab44-653e-4d31-843b-c67276a9395f',
      plannedId: 'b5c9ab44-653e-4d31-843b-c67276a9395f',
      quantity: 12,
      // name: 'Jane Doe',
      // title: 'CEO',
      items: [
        {
          id: '2',
          unit: 'hours',
          actualId: '',
          plannedId: '',
          lotId: 'e7949809-b5e2-4a44-a6f0-2594424c127b',
          quantity: 12,
        },
      ],
    },
  ];

  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['1', '2']));

  const handleExpandChange = (event: TreeListExpandChangeEvent) => {
    const newExpanded = new Set(expanded);
    const id = event.dataItem.id;
    event.value ? newExpanded.add(id) : newExpanded.delete(id);
    setExpanded(newExpanded);
  };

  const extendWithExpanded = (items: Material[]) =>
    items.map(item => ({
      ...item,
      expanded: expanded.has(item.id),
      items: item.items ? extendWithExpanded(item.items) : undefined,
    }));

  console.log('extendWithExpanded(treeData)', extendWithExpanded(treeData));

  return (
    <Box className={classes.root} data-cy="material-grid">
      <TreeList
        data={extendWithExpanded(treeData)}
        subItemsField="items"
        expandField="expanded"
        onExpandChange={handleExpandChange}
        rowRender={rowRender}
        dataItemKey="id"
        columns={schema}
      />

      {/* <KendoDataGrid<EditableMaterial>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={materialList as EditableMaterial[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      /> */}
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          // onClick={}
          data-cy="add-material"
        >
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

export default MaterialsTable;
