import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import { styles } from './styles';

export const PrimaryAttachments: React.FC<TreeListHeaderCellProps> = () => {
  const classes = styles();

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <Tooltip
        title={translate('bom.table.title.primary.attachments')}
        placement="top"
      ><>
          <FontAwesomeIcon icon={regular('paperclip')} className={classes.icon} />
          <FontAwesomeIcon icon={solid('star')} className={classes.star} />
        </>
      </Tooltip>
    </Grid>
  );
};
