import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { styles } from './styles';

export const Issues: React.FC<TreeListHeaderCellProps> = () => {
  const classes = styles();

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <FontAwesomeIcon icon={regular('hexagon-exclamation')} className={classes.issues} />
    </Grid>
  );
};
