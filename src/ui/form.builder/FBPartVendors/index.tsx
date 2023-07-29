import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, InputAdornment } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Button, FormField, TextField } from '../../components/forms/fields-next';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { ActionsCell } from './components/ActionsCell';
import { FIELDS_TO_OMIT, SUPPLIER_FIELD, SUPPLIER_STATUS_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableVendor, FBPartVendorsProps, Vendor, VendorEditEvent } from './types';
import { withFBPartVendors } from './wrap';

const FBPartVendors: React.FC<FBPartVendorsProps> = ({
  label = 'form.builder.part.vendors.title',
  name = '',
  disabled,
  list = [],
  units = [],
  statuses = [],
  suppliers = [],
  standardCost,
  standardLeadTime,
  deleteVendor,
  updateVendor,
  setPrimaryVendor,
  setStandardCost,
  setStandardLeadTime,
  ...props
}) => {
  const classes = useStyles();
  const isActive = !disabled;
  const [editedVendor, setEditedVendor] = React.useState<Partial<EditableVendor>>();

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

  const { resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedVendor ?? {} });
  }, [editedVendor, setValues, resetForm]);

  const createDraftVendor = () => setEditedVendor({
    id: uuidv4(),
    primary: list.length === 0,
    [MODE_FIELD]: Mode.add,
  });

  const discardVendor = () => setEditedVendor(undefined);

  const removeVendor = () => {
    if (!editedVendor) {
      return;
    }
    deleteVendor?.(editedVendor as Vendor);
    discardVendor();
  };

  const rowRender: DataGridProps<EditableVendor>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableVendor;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const shouldDisableDelete = item.primary;

    const deleteTootltipText
      = shouldDisableDelete
        ? translate('form.builder.part.vendors.primary.delete.message')
        : undefined;

    const actions = (
      <td className={classes.actionsCell} key="actions">
        <ActionsCell
          dataItem={item}
          onConfirm={formik.submitForm}
          onDiscard={discardVendor}
          onDelete={removeVendor}
          deleteTooltipText={deleteTootltipText}
          isDeleteDisabled={shouldDisableDelete}
          rootClassName={classes.popperHolder}
        />
      </td>
    );

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
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
    setPrimaryVendor,
    onRowClick: handleRowClick,
  });

  const vendorsList = list.reduce((list, item) => {
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
    <Box position="relative">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="partVendors" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftVendor}
            >
              {translate('form.builder.part.vendors.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <KendoDataGrid<EditableVendor>
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
          onClick={createDraftVendor}
        >
          {translate('form.builder.part.vendors.add')}
        </Button>
      )}
      <Box mt={3}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <FormField
              label="form.builder.part.vendors.cost.standard"
            >
              <TextField
                type="number"
                inputProps={{ min: 0 }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                value={standardCost?.value}
                onChange={(e) => setStandardCost?.(Number(e.target.value))}
              />
            </FormField>
          </Grid>
          <Grid item xs={6}>
            <FormField
              label="form.builder.part.vendors.lead.time.standard"
            >
              <TextField
                type="number"
                inputProps={{ min: 0 }}
                value={standardLeadTime}
                onChange={(e) => setStandardLeadTime?.(Number(e.target.value))}
              />
            </FormField>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withFBPartVendors(FBPartVendors);
