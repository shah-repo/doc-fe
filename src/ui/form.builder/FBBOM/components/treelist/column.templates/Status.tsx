import { Chip, Grid } from '@material-ui/core';
import cx from 'classnames';
import React, { ComponentType } from 'react';
import { statusClassMapping } from '../../../../../components/common/kendo/helpers';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const Status: ComponentType<CustomTreeListCellProps> | undefined = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  ...otherProps
}) => {
  const classes = styles();
  const status = dataItem.displayStatus;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx('k-table-td', className, classes.cellborderBottom)}
      {...{
        'aria-colindex': otherProps.ariaColumnIndex,
        'data-grid-col-index': otherProps.colIndex,
        'aria-expanded': otherProps.expanded,
      }}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
      >
        <Tooltip
          data={status}
          childrenElement={
            <Chip
              size="small"
              className={`${classes.chip} ${
                classes[statusClassMapping[status]]
              }`}
              label={status}
            />
          }
        />
      </Grid>
    </td>
  );
};
