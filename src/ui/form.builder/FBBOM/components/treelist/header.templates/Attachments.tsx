import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { TreeListHeaderCellProps } from '@progress/kendo-react-treelist';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import useHover from '../../../../../hooks/useHover';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from '../column.templates/CustomColumnMenu';
import { styles } from './styles';

export const Attachments: React.FC<TreeListHeaderCellProps> | undefined = (
  props,
) => {
  const classes = styles();
  const { onLock, columns, onColumnShowHide, isMaximizedView }
    = React.useContext(ColumnMenuContext);
  const { field } = props;
  const [attachmentsRef, isHovered] = useHover<HTMLButtonElement>();

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
        <span ref={attachmentsRef} className={classes.iconContainer}>
          <FontAwesomeIcon
            icon={isHovered ? regular('paperclip') : solid('paperclip')}
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
};
