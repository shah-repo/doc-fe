import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import { styles } from './styles';

export const Attachments: React.FC<TreeListHeaderCellProps> | undefined = () => {
  const classes = styles();

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <Tooltip
        title={translate('bom.table.title.attachments')}
        placement="top"
        arrow
      >
        <FontAwesomeIcon icon={solid('paperclip')} className={classes.icon} />
      </Tooltip>
    </Grid>
  );
};
