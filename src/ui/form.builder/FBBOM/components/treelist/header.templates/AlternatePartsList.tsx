import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { styles } from './styles';

export const AlternatePartsList: React.FC<TreeListHeaderCellProps> = () => {
  const classes = styles();
  const [hover, setHover] = useState(false);

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Tooltip
          title={translate('bom.table.title.alternate.parts.list')}
          placement="top"
        >
          <FontAwesomeIcon icon={hover ? solid('screwdriver-wrench') : regular('screwdriver-wrench')} className={classes.icon} />
        </Tooltip>
      </div>
    </Grid>
  );
};
