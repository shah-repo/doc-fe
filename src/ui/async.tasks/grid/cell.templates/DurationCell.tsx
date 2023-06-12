import { GridCellProps } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { styles } from '../presenter.styles';

export const DurationCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
  field,
}: GridCellProps) => {
  const classes = styles();
  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      role="gridcell"
      data-grid-col-index={columnIndex}
      className={classes.groupCell}
    >
      {field === 'duration' ? (
        <Tooltip
          data={moment
            .duration(get(dataItem, field as string), 'seconds')
            .humanize()}
        />
      ) : (
        <Tooltip
          data={moment
            .utc(get(dataItem, field as string))
            .format(MomentFormats.DateTimeSeconds)}
        />
      )}
    </td>
  );
};
