import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import DocumentRevisionDialog from '../../../components/common/dialogs/DocumentRevisionDialog';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import useDialog from '../../../hooks/useDialog';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableMaterial, Material, MaterialTableProps } from './types';
import { withMaterialTableWrap } from './wrap';

const ScanLotTable: React.FC<MaterialTableProps> = ({
  units,
  materials,
  updateMaterial,
  deleteMaterial,
}) => {
  const classes = useStyles();
  const [editedScanLot, setEditedScanLot] = useState<Partial<EditableMaterial>>();
  const isScanLotEdited = editedScanLot?.[MODE_FIELD] === Mode.add;
  const editScanLot = ({ dataItem }) => setEditedScanLot(dataItem);
  const isInEditMode = editedScanLot !== undefined;
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
    resetForm({ values: editedScanLot ?? {} });
  }, [editedScanLot, setValues, resetForm]);

  const discardScanLot = () => setEditedScanLot(undefined);

  const removeScanLot = (lot: EditableMaterial) => {
    deleteMaterial?.(lot);
    discardScanLot();
  };

  const openQuickView = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dataItem: EditableMaterial,
  ) => {
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

  const scanLotList = materials.reduce(
    (list, item) => {
      const isScanLotEdited = editedScanLot && editedScanLot.id === item.id;

      return [
        ...list,
        {
          ...(isScanLotEdited ? editedScanLot : item),
          [MODE_FIELD]: isScanLotEdited ? Mode.edit : Mode.show,
        },
      ];
    },
    isScanLotEdited ? [editedScanLot] : [],
  );

  return (
    <Box className={classes.root} data-cy="scan-lot-grid">
      <KendoDataGrid<EditableMaterial>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={scanLotList as EditableMaterial[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      <DocumentRevisionDialog
        dialog={quickViewDialog}
        {...{
          docRevId: selectedDataItem?.lotNumber?.id,
        }}
      />
    </Box>
  );
};

export default withMaterialTableWrap(ScanLotTable);
