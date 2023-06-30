import { Chip, Grid, Tooltip } from '@material-ui/core';
import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { statusClassMapping } from '../../../components/common/kendo/helpers';
import useStyles from '../styles';
import { EditableVendorData } from '../types';
interface Props extends CellTemplateProps<EditableVendorData> {}

export const SupplierStatusCellTemplate: React.FC<Props> = ({ dataItem }) => {
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
