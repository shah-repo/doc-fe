import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../../common/intl';
import { Button } from '../../../../../forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../KendoDataGrid/constants';
import KendoDataGrid from '../../../../../KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableScanLot } from './types';
import { withFBScanLot } from './wrap';

const ScanLotTable: React.FC = () => {
  const classes = useStyles();
  const [editedScanLot, setEditedScanLot] = useState<Partial<EditableScanLot>>();
  // const isVendorAdded = editedScanLot?.[MODE_FIELD] === Mode.add;
  const editScanLot = ({ dataItem }) => setEditedScanLot(dataItem);
  const isInEditMode = editedScanLot !== undefined;
  const handleRowClick = !isInEditMode ? editScanLot : undefined;

  const formik = useFormik<Partial<EditableScanLot>>({
    initialValues: {},
    onSubmit: (values) => {
      const scanLot = omit(values, FIELDS_TO_OMIT);
      console.log('scanLot', scanLot);
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedScanLot ?? {} });
  }, [editedScanLot, setValues, resetForm]);

  const createDraftScanLot = () => setEditedScanLot({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const discardScanLot = () => setEditedScanLot(undefined);

  const removeScanLot = () => {
    if (!editedScanLot) return;

    discardScanLot();
  };

  const rowRender: DataGridProps<EditableScanLot>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableScanLot;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const schema = buildSchema({
    isInEditMode,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
    // onPrimaryChange: setPrimaryVendor,
  });

  // const vendorsList = vendors.reduce((list, item) => {
  //   const isVendorEdited = editedScanLot && editedScanLot.id === item.id;
  //   const supplier = suppliers.find((vendor) => vendor.id === item.vendor.id);
  //   const supplierName = supplier?.name ?? item.vendor?.name;
  //   const supplierStatus = supplier?.displayStatus ?? '';
  //   const supplierState = supplier?.supplierStatusId ?? '';

  //   return [
  //     ...list,
  //     {
  //       ...(isVendorEdited ? editedScanLot : item),
  //       [SUPPLIER_FIELD]: supplierName,
  //       [SUPPLIER_STATUS_FIELD]: supplierStatus,
  //       [SUPPLIER_STATE_FIELD]: supplierState,
  //       [MODE_FIELD]: isVendorEdited ? Mode.edit : Mode.show,
  //     },
  //   ];
  // }, isVendorAdded ? [editedScanLot] : []);

  return (
    <Box className={classes.root} data-cy="part-vendors">
      <KendoDataGrid<EditableScanLot>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={[]}
        // onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      <Button
        kind="add"
        fullWidth
        attached
        disabled={isInEditMode}
        onClick={createDraftScanLot}
        data-cy="add-button"
      >
        {translate('form.builder.part.vendors.add')}
      </Button>
    </Box>
  );
};

export default withFBScanLot(ScanLotTable);
