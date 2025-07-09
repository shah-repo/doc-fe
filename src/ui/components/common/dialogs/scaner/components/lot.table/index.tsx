import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';
import KendoDataGrid from '../../../../../KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableScanLot, ScanLot, ScanLotTableProps } from './types';
import { withFBScanLot } from './wrap';

const ScanLotTable: React.FC<ScanLotTableProps> = ({
  scanLots,
  units,
  lots,
  updateScanLot,
  deleteScanLot,
}) => {
  const classes = useStyles();
  const [editedScanLot, setEditedScanLot] = useState<Partial<EditableScanLot>>();
  const isScanLotEdited = editedScanLot?.[MODE_FIELD] === Mode.add;
  const editScanLot = ({ dataItem }) => setEditedScanLot(dataItem);
  const isInEditMode = editedScanLot !== undefined;
  const handleRowClick = !isInEditMode ? editScanLot : undefined;

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

  const schema = buildSchema({
    units,
    lots,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
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
    <Box className={classes.root} data-cy="scan-lot-grid">
      <KendoDataGrid<EditableScanLot>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={scanLotList as EditableScanLot[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
    </Box>
  );
};

export default withFBScanLot(ScanLotTable);
