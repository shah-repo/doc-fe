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

export const PrimaryAttachments: React.FC<TreeListHeaderCellProps> = (
  props,
) => {
  const classes = styles();
  const { onLock, columns, onColumnShowHide, isMaximizedView }
    = React.useContext(ColumnMenuContext);
  const { field } = props;
  const [primaryAttachmentsRef, isHovered] = useHover<HTMLButtonElement>();

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
        arrow
      >
        <span ref={primaryAttachmentsRef} className={classes.iconContainer}>
          <FontAwesomeIcon
            icon={isHovered ? solid('paperclip') : regular('paperclip')}
            className={classes.icon}
          />
          <FontAwesomeIcon icon={solid('star')} className={classes.star} />
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
