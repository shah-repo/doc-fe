import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { ColumnMenuContext, CustomColumnMenu } from '../column.templates/CustomColumnMenu';
import { styles } from './styles';

export const AlternatePartsList: React.FC<TreeListHeaderCellProps> = (props) => {
  const classes = styles();
  const [isHovered, setIsHovered] = useState(false);
  const { onLock, columns, onColumnShowHide } = React.useContext(ColumnMenuContext);
  const { field } = props;

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
          title={translate('bom.table.title.alternate.parts.list')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon
            className={classes.icon}
            icon={isHovered ? solid('screwdriver-wrench') : regular('screwdriver-wrench')}
          />
        </Tooltip>
      </div>
      <div>
        <CustomColumnMenu
          {...{
            field,
            onLock,
            columns,
            onColumnShowHide,
          }}
        />
      </div>
    </Grid>
  );
};
