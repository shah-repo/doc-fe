import { Box, Typography } from '@material-ui/core';
import { GridToolbar } from '@progress/kendo-react-grid';
import React, { forwardRef, memo } from 'react';
import { translate } from '../../../../../common/intl';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { SupplierScanResultRevision } from '../../interface';
import { buildSchema } from './schema';
import useStyles from './styles';
import { BooleanRef, FormInputComparisonProps } from './types';

const FormInputComparison = forwardRef<BooleanRef, FormInputComparisonProps>(({ dataItem }, ref) => {
  const classes = useStyles();
  const schema = buildSchema();

  return (
    <Box className={classes.root} data-cy="site-contact">
      <KendoDataGrid<SupplierScanResultRevision>
        className={classes.detailsGrid}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={[dataItem]}
      >
        <GridToolbar>
          <Typography variant="h5" gutterBottom component="div">
            {translate('administration.bulk.migration.comparison.grid.title')}
          </Typography>
        </GridToolbar>
      </KendoDataGrid>
    </Box>
  );
});

export default memo(FormInputComparison);
