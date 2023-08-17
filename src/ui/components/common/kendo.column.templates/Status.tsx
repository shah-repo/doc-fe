import { Chip, Grid } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { LotStatus, POStatusLabelMapping } from '../../../../state/ducks/documentRevisions/types';
import { KendoGridFilterCell } from '../../KendoGrid/interfaces';
import { getLotStatusLabel } from '../header/HeaderLotStatus';
import Tooltip from '../kendo/Tooltip';
import { statusClassMapping } from '../kendo/helpers';
import { CustomGridCellProps } from '../kendo/types';
import { styles } from './Status.styles';

export const Status: React.FC<CustomGridCellProps> = ({
  dataItem,
  field = '',
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const classes = styles();
  const status = dataItem[field] as string;
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };
  let fieldLabel = status;
  if (field === KendoGridFilterCell.PO_STATUS) {
    fieldLabel = POStatusLabelMapping[status] as string;
  }
  if (field === KendoGridFilterCell.LOT_STATUS) {
    fieldLabel = getLotStatusLabel(status as LotStatus);
  }
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
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
              className={cx(classes.chip, classes[statusClassMapping[status]])}
              label={fieldLabel}
            />
          }
        />
      </Grid>
    </td>
  );
};
