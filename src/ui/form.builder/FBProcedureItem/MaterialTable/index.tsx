import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { differenceBy, omit, unionBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import DocumentRevisionDialog from '../../../components/common/dialogs/DocumentRevisionDialog';
import { Button } from '../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import useDialog from '../../../hooks/useDialog';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableMaterial, Material, MaterialTableProps } from './types';
import { useOptions } from './utils';

const MaterialsTable: React.FC<MaterialTableProps> = ({ isActive }) => {
  const classes = useStyles();
  const [editedMaterial, setEditedScanLot] = useState<Partial<EditableMaterial>>();
  const [materials, setMaterials] = useState<Material[]>();
  const isMaterialEdited = editedMaterial?.[MODE_FIELD] === Mode.add;
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

  const rowRender: DataGridProps<EditableMaterial>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableMaterial;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(row, {
      className: cx(row.props.className, classes.updatingRow),
    });

    return <FormikProvider value={formik}>{editedRow}</FormikProvider>;
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

  const materialList = materials?.reduce(
    (list, item) => {
      const isMaterialEdited = editedMaterial && editedMaterial.id === item.id;

      return [
        ...list,
        {
          ...(isMaterialEdited ? editedMaterial : item),
          [MODE_FIELD]: isMaterialEdited ? Mode.edit : Mode.show,
        },
      ];
    },
    isMaterialEdited ? [editedMaterial] : [],
  );

  return (
    <Box className={classes.root} data-cy="material-grid">
      <KendoDataGrid<EditableMaterial>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={materialList as EditableMaterial[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
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
