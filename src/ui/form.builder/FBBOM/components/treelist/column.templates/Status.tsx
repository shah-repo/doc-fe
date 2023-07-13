import { Chip, Grid } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { statusClassMapping } from '../../../../../components/common/kendo/helpers';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { ADD_FIELD, MODE_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
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
  const isEditMode = dataItem[MODE_FIELD] || dataItem[ADD_FIELD];
  const classes = styles({ isEditMode });
  const { values } = useFormikContext<EditableBOM>();
  const status = isEditMode ? values.displayStatus : dataItem[field];

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
      {status && <Grid
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
      </Grid>}
    </td>
  );
};
