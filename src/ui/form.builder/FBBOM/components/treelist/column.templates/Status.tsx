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
}) => {
  const classes = styles();
  const status = dataItem.displayStatus;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
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
