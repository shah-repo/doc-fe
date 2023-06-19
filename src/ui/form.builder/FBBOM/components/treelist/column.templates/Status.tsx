import { Chip, Grid } from '@material-ui/core';
import React, { ComponentType } from 'react';
import { statusClassMapping } from '../../../../../components/common/kendo/helpers';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { CustomTreeListCellProps } from './interface';
import { styles } from './Status.styles';

export const Status: ComponentType<CustomTreeListCellProps> | undefined = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
}) => {
  const classes = styles();
  const status = dataItem[field ?? ''] as string;
  const fieldLabel = status;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
      >
        <Tooltip
          data={fieldLabel}
          childrenElement={
            <Chip
              size="small"
              className={`${classes.chip} ${
                classes[statusClassMapping[status]]
              }`}
              label={fieldLabel}
            />
          }
        />
      </Grid>
    </td>
  );
};
