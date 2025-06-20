import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { Button } from '../../../../../forms/fields-next';
import KendoDataGrid from '../../../../../KendoDataGrid/KendoDataGrid';
import useStyles from './styles';

const ScanLot: React.FC = () => {
  const classes = useStyles();
  // const primarySupplierDialog = useDialog();
  // const isActive = !disabled;
  // const [editedVendor, setEditedVendor] = useState<Partial<EditableScanLot>>();
  // const [newPrimaryVendor, setNewPrimaryVendor] = useState<EditableScanLot>();

  // const isVendorAdded = editedVendor?.[MODE_FIELD] === Mode.add;
  // const editVendor = ({ dataItem }: VendorEditEvent) => setEditedVendor(dataItem);
  // const isInEditMode = editedVendor !== undefined;
  // const handleRowClick = isActive && !isInEditMode ? editVendor : undefined;

  // const formik = useFormik<Partial<EditableScanLot>>({
  //   initialValues: {},
  //   onSubmit: (values) => {
  //     const vendorToSave = omit(values, FIELDS_TO_OMIT);
  //     updateVendor?.(vendorToSave as Vendor);
  //     discardVendor();
  //   },
  // });

  // const { submitForm, resetForm, setValues, dirty } = formik;

  // useEffect(() => {
  //   resetForm({ values: editedVendor ?? {} });
  // }, [editedVendor, setValues, resetForm]);

  // const createDraftVendor = () => setEditedVendor({
  //   id: uuidv4(),
  //   primary: vendors.length === 0,
  //   [MODE_FIELD]: Mode.add,
  // });

  // const discardVendor = () => setEditedVendor(undefined);

  // const removeVendor = () => {
  //   if (!editedVendor) return;

  //   if (editedVendor.primary) {
  //     if (vendors.length === 2) {
  //       const remainingVendor = vendors.find(v => v !== editedVendor && !v?.primary);
  //       if (remainingVendor) {
  //         deleteVendor?.(editedVendor as Vendor, remainingVendor.id);
  //         discardVendor();
  //         return;
  //       }
  //     } else if (vendors.length > 2) {
  //       primarySupplierDialog.open();
  //       setNewPrimaryVendor(undefined);
  //       return;
  //     }
  //   }

  //   deleteVendor?.(editedVendor as Vendor);
  //   discardVendor();
  // };

  // const deletePrimaryVendor = () => {
  //   if (newPrimaryVendor) {
  //     deleteVendor?.(editedVendor as Vendor, newPrimaryVendor.id);
  //     discardVendor();
  //   }
  //   primarySupplierDialog.close();
  // };

  // const onPrimaryVendorChange = (e, value: EditableScanLot) => {
  //   setNewPrimaryVendor(value);
  // };

  // const handleDialogClose = () => {
  //   setNewPrimaryVendor(undefined);
  //   primarySupplierDialog.close();
  // };

  // const rowRender: DataGridProps<EditableScanLot>['rowRender'] = (row, { dataItem }) => {
  //   const item = dataItem as EditableScanLot;
  //   const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
  //   if (!isUpdating) {
  //     return row;
  //   }

  //   const editedRow = React.cloneElement(
  //     row,
  //     {
  //       className: cx(row.props.className, classes.updatingRow),
  //     },
  //   );

  //   return (
  //     <FormikProvider value={formik}>
  //       {editedRow}
  //     </FormikProvider>
  //   );
  // };

  // const schema = buildSchema({
  //   units,
  //   statuses,
  //   states,
  //   suppliers,
  //   isActive,
  //   isLoading,
  //   isInEditMode,
  //   actionsClass: classes.actionsCell,
  //   onRowClick: handleRowClick,
  //   onConfirm: submitForm,
  //   onDiscard: discardVendor,
  //   onDelete: removeVendor,
  //   onPrimaryChange: setPrimaryVendor,
  // });

  // const vendorsList = vendors.reduce((list, item) => {
  //   const isVendorEdited = editedVendor && editedVendor.id === item.id;
  //   const supplier = suppliers.find((vendor) => vendor.id === item.vendor.id);
  //   const supplierName = supplier?.name ?? item.vendor?.name;
  //   const supplierStatus = supplier?.displayStatus ?? '';
  //   const supplierState = supplier?.supplierStatusId ?? '';

  //   return [
  //     ...list,
  //     {
  //       ...(isVendorEdited ? editedVendor : item),
  //       [SUPPLIER_FIELD]: supplierName,
  //       [SUPPLIER_STATUS_FIELD]: supplierStatus,
  //       [SUPPLIER_STATE_FIELD]: supplierState,
  //       [MODE_FIELD]: isVendorEdited ? Mode.edit : Mode.show,
  //     },
  //   ];
  // }, isVendorAdded ? [editedVendor] : []);

  return (
    <Box className={classes.root} data-cy="part-vendors">
      <KendoDataGrid<EditableScanLot>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={ []}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftVendor}
          data-cy="add-button"
        >
          {translate('form.builder.part.vendors.add')}
        </Button>
      )}
    </Box>
  );
};

export default withFBPartVendors(ScanLot);
