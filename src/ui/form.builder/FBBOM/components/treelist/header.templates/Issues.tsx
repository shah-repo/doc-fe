import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../../../common/intl';
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
      <Tooltip
        title={translate('bom.table.title.issues')}
        placement="top"
      >
        <FontAwesomeIcon icon={regular('hexagon-exclamation')} className={classes.issues} />
      </Tooltip>
    </Grid>
  );
};
