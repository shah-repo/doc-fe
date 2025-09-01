import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { FBProcedureItemType } from '../../../../../../form.builder';
import useDialog from '../../../../../../hooks/useDialog';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';
import KendoDataGrid from '../../../../../KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import DocumentRevisionDialog from '../../../DocumentRevisionDialog';
import { FIELDS_TO_OMIT } from './constants';
import { buildEqSchema } from './eqSchema';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableScanLot, ScanLot, ScanLotTableProps } from './types';
import { withFBScanLot } from './wrap';

const ScanLotTable: React.FC<ScanLotTableProps> = ({ scanLots, units, loading, updateScanLot, deleteScanLot, type, isSerialNumberHidden }) => {
  const classes = useStyles();
  const [editedScanLot, setEditedScanLot] = useState<Partial<EditableScanLot>>();
  const isEquipmentScan = type === FBProcedureItemType.equipment;
  const isScanLotEdited = editedScanLot?.[MODE_FIELD] === Mode.add;
  const editScanLot = ({ dataItem }) => setEditedScanLot(dataItem);
  const isInEditMode = editedScanLot !== undefined;
  const handleRowClick = !isInEditMode ? editScanLot : undefined;
  const [selectedDataItem, setSelectedDataItem] = useState<EditableScanLot>();
  const quickViewDialog = useDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<Partial<EditableScanLot>>({
    initialValues: {},
    onSubmit: (values) => {
      const scanLot = omit(values, FIELDS_TO_OMIT);
      updateScanLot?.(scanLot as ScanLot);
      discardScanLot();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedScanLot ?? {} });
  }, [editedScanLot, setValues, resetForm]);

  const discardScanLot = () => setEditedScanLot(undefined);

  const removeScanLot = (lot: EditableScanLot) => {
    deleteScanLot?.(lot);
    discardScanLot();
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableScanLot) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender: DataGridProps<EditableScanLot>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableScanLot;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(row, {
      className: cx(row.props.className, classes.updatingRow),
    });

    return <FormikProvider value={formik}>{editedRow}</FormikProvider>;
  };

  const schema = (isEquipmentScan ? buildEqSchema : buildSchema)({
    units,
    isSerialNumberHidden,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
    onOpenQuickView: openQuickView,
    onEdit: setEditedScanLot,
  });

  const scanLotList = scanLots.reduce(
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
    <div ref={containerRef} className={classes.root} data-cy="scan-lot-grid">
      <KendoDataGrid<EditableScanLot>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        containerRef={containerRef}
        loading={loading}
        data={scanLotList as EditableScanLot[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: selectedDataItem?.lotNumber?.id }} />
    </div>
  );
};

export default withFBScanLot(ScanLotTable);
