import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import Text from '../../components/Text';
import Dialog from '../../components/dialogs';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Autocomplete, Button } from '../../components/forms/fields-next';
import useDialog from '../../hooks/useDialog';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { FIELDS_TO_OMIT, SUPPLIER_FIELD, SUPPLIER_STATUS_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableVendor, FBPartVendorsProps, Vendor, VendorEditEvent } from './types';
import { withFBPartVendors } from './wrap';

const FBPartVendors: React.FC<FBPartVendorsProps> = ({
  label = 'form.builder.part.vendors.title',
  name = '',
  disabled,
  units = [],
  statuses = [],
  vendors = [],
  suppliers = [],
  deleteVendor,
  updateVendor,
  setPrimaryVendor,
  ...props
}) => {
  const classes = useStyles();
  const primarySupplierDialog = useDialog();
  const isActive = !disabled;
  const [editedVendor, setEditedVendor] = useState<Partial<EditableVendor>>();
  const [newPrimaryVendor, setNewPrimaryVendor] = useState<EditableVendor>();

  const isVendorAdded = editedVendor?.[MODE_FIELD] === Mode.add;
  const editVendor = ({ dataItem }: VendorEditEvent) => setEditedVendor(dataItem);
  const isInEditMode = editedVendor !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editVendor : undefined;

  const formik = useFormik<Partial<EditableVendor>>({
    initialValues: {},
    onSubmit: (values) => {
      const vendorToSave = omit(values, FIELDS_TO_OMIT);
      updateVendor?.(vendorToSave as Vendor);
      discardVendor();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedVendor ?? {} });
  }, [editedVendor, setValues, resetForm]);

  const createDraftVendor = () => setEditedVendor({
    id: uuidv4(),
    primary: vendors.length === 0,
    [MODE_FIELD]: Mode.add,
  });

  const discardVendor = () => setEditedVendor(undefined);

  const removeVendor = () => {
    if (!editedVendor) return;

    if (editedVendor.primary) {
      if (vendors.length === 2) {
        const remainingVendor = vendors.find(v => v !== editedVendor && !v?.primary);
        if (remainingVendor) {
          setPrimaryVendor(remainingVendor.id);
           deleteVendor?.(editedVendor as Vendor, remainingVendor.id);
           discardVendor();
           return;
        }
      } else if (vendors.length > 2) {
        primarySupplierDialog.open();
        setNewPrimaryVendor(undefined);
        return;
      }
    }

   deleteVendor?.(editedVendor as Vendor);
   discardVendor();
  };

  const deletePrimaryVendor = () => {
    if (newPrimaryVendor) {
       deleteVendor?.(editedVendor as Vendor, newPrimaryVendor.id);
       discardVendor();
    }
    primarySupplierDialog.close();
  };

  const onPrimaryVendorChange = (e, value: EditableVendor) => {
    setNewPrimaryVendor(value);
  };

  const handleDialogClose = () => {
    setNewPrimaryVendor(undefined);
    primarySupplierDialog.close();
  };

  const rowRender: DataGridProps<EditableVendor>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableVendor;
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
    units,
    statuses,
    suppliers,
    isActive,
    isInEditMode,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardVendor,
    onDelete: removeVendor,
    onPrimaryChange: setPrimaryVendor,
  });

  const vendorsList = vendors.reduce((list, item) => {
    const isVendorEdited = editedVendor && editedVendor.id === item.id;
    const supplier = suppliers.find((vendor) => vendor.id === item.vendor.id);
    const supplierName = supplier?.name ?? item.vendor?.name;
    const supplierStatus = supplier?.displayStatus ?? '';

    return [
      ...list,
      {
        ...(isVendorEdited ? editedVendor : item),
        [SUPPLIER_FIELD]: supplierName,
        [SUPPLIER_STATUS_FIELD]: supplierStatus,
        [MODE_FIELD]: isVendorEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isVendorAdded ? [editedVendor] : []);

  return (
    <Box className={classes.root} data-cy="part-vendors">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="partVendors" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              disabled={isInEditMode}
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftVendor}
              data-cy="add-link"
            >
              {translate('form.builder.part.vendors.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <KendoDataGrid<EditableVendor>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={vendorsList as EditableVendor[]}
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
      <Dialog
        open={primarySupplierDialog.isOpen}
        title="relatedParts.set.new.primary.supplier"
        confirmLabel="common.confirm"
        cancelLabel = "common.cancel"
        onConfirm={deletePrimaryVendor}
        onCancel={handleDialogClose}
        onClose={handleDialogClose}
        confirmProps={{
          disabled: !newPrimaryVendor,
        }}
      >
        <Text
          translation="relatedParts.confirm.delete.primary.supplier.message"
        />
        <Autocomplete
          blurOnSelect
          disableClearable
          className={classes.marginTop}
          value={newPrimaryVendor}
          onChange={onPrimaryVendorChange}
          options={vendorsList.filter(v => v.id !== editedVendor?.id)}
          getOptionLabel={(vendors: EditableVendor) => vendors?.vendor?.name}
        />
      </Dialog>
    </Box>
  );
};

export default withFBPartVendors(FBPartVendors);
