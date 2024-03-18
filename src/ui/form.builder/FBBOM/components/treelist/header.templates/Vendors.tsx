import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { memo } from 'react';
import { translate } from '../../../../../../common/intl';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from '../../../../../components/common/treelist/column.templates/CustomColumnMenu';
import useHover from '../../../../../hooks/useHover';
import { styles } from './styles';

export const Vendors: React.FC<TreeListHeaderCellProps> = memo((props) => {
  const classes = styles();
  const [vendorContainerRef, isHovered] = useHover<HTMLButtonElement>();
  const { onLock, columns, onColumnShowHide, isMaximizedView }
    = React.useContext(ColumnMenuContext);
  const { field } = props;

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <Tooltip
        title={translate('bom.table.title.vendors')}
        placement="top"
        arrow
      >
        <span ref={vendorContainerRef} className={classes.iconContainer}>
          <FontAwesomeIcon
            className={classes.icon}
            icon={isHovered ? solid('receipt') : regular('receipt')}
          />
        </span>
      </Tooltip>
      {!isMaximizedView && (
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
      )}
    </Grid>
  );
});
