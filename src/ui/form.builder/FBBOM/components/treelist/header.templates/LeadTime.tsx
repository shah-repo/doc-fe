import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React, { memo } from 'react';
import { translate } from '../../../../../../common/intl';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from '../../../../../components/common/treelist.column.templates/CustomColumnMenu';
import useHover from '../../../../../hooks/useHover';
import { styles } from './styles';

export const LeadTime: React.FC<TreeListHeaderCellProps> = memo((props) => {
  const classes = styles();
  const { onLock, columns, onColumnShowHide, isMaximizedView }
    = React.useContext(ColumnMenuContext);
  const { field } = props;
  const [leadtimeRef, isHovered] = useHover<HTMLButtonElement>();

  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
    >
      <Tooltip
        title={translate('bom.treelist.treeColumns.field.leadTime.title')}
        placement="top"
        arrow
      >
        <span ref={leadtimeRef} className={classes.iconContainer}>
          <FontAwesomeIcon
            icon={
              isHovered ? solid('calendar-clock') : regular('calendar-clock')
            }
            className={classes.icon}
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
