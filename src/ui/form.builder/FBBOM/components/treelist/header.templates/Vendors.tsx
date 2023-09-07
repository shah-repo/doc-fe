import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { styles } from './styles';

export const Vendors: React.FC<TreeListHeaderCellProps> = () => {
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
          title={translate('bom.table.title.vendors')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon
            className={classes.icon}
            icon={isHovered ? solid('receipt') : regular('receipt')}
          />
        </Tooltip>
      </div>
    </Grid>
  );
};
