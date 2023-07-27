import { Chip, Grid, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { statusClassMapping } from '../../../components/common/kendo/helpers';
import { FormikField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import useStyles from '../styles';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const SupplierStatusCellTemplate: React.FC<Props> = ({ field, dataItem }) => {
  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps } = useFormikContext<EditableVendorData>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const value = isEditMode ? values.supplier?.status : dataItem.status;

  return (
    <FormikField
      name={field}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
        {...getFieldProps(field)}
      >
        <Grid item >
          <Tooltip title={value}>
            <Chip
              size="small"
              className={value ? `${classes.chip} ${classes[statusClassMapping[value]]}` : classes.displayNone}
              label={value}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </FormikField>
  );
};
