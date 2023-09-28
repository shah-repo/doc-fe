import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { styles } from './styles';

export const Issues: React.FC<TreeListHeaderCellProps> = () => {
  const classes = styles();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip
          title={translate('bom.table.title.issues')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon
            className={classes.issues}
            icon={isHovered ? solid('hexagon-exclamation') : regular('hexagon-exclamation')}
          />
        </Tooltip>
      </div>
    </Grid>
  );
};
