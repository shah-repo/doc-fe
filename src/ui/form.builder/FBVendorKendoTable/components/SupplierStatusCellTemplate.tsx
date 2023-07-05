import { Chip, Grid, Tooltip } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { statusClassMapping } from '../../../components/common/kendo/helpers';
import useStyles from '../styles';
import { EditableVendorData, VendorOption } from '../types';

import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import { Autocomplete } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
interface Props extends CellTemplateProps<EditableVendorData> {}

export const SupplierStatusCellTemplate: React.FC<Props> = ({ dataItem, vendors }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <Grid item >
        <Tooltip title={dataItem.status}>
          <Chip
            size="small"
            className={`${classes.chip} ${classes[statusClassMapping[dataItem.status]]}`}
            label={dataItem.status}
          />
        </Tooltip>
      </Grid>

    </Grid>
  );
};

interface Props extends CellTemplateProps<EditableVendorData> {
  vendors?: VendorOption[]
}

const getOptionLabel = (option: VendorOption) => {
  console.log('vendorStatus', option.status);
  return option.name;
};

export const SupplierCellTemplate: React.FC<Props> = ({ dataItem, vendors }) => {
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableVendorData>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  // const isPrimaryVendor = <FBTooltip
  //   title="Primary Vendor"
  // >
  //   {dataItem.supplier === 'ProtoLabs' ? <div style={{ height: 10, width: 10, borderRadius: '50%', backgroundColor: Colors.dodger_blue, marginRight: 8 }} /> : ''}
  // </FBTooltip>;

  const handleChange = (event: ChangeEvent<unknown>, vendor?: VendorOption) => {
    const value = vendor ? {
      id: vendor.id,
      docId: vendor.document.docId,
    } : undefined;
    setFieldValue('vendor', value);
  };

  const defaultValue = isEditMode ? values.vendor?.id : dataItem.vendor?.id;
  const value = vendors?.find((vendor) => vendor.id === defaultValue);
  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (

      <Autocomplete
        {...getFieldProps('vendor')}
        blurOnSelect
        options={vendors}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={handleChange}
        size="small"
      />
    );
  }
  return <>{value ? getOptionLabel(value) : dataItem.vendor}</>;
};
