import { Grid } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { removeLastCharacterIfNotAlphaNumeric } from '../../../common/utils/helpers';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { CustomGridCellProps } from '../../../components/common/kendo/types';

export const DocumentTypeCellTemplate = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const documentType = get(dataItem, field || '');
  if (rowType === 'groupHeader') {
    return null;
  }
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };
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
        {documentType && <Tooltip data={removeLastCharacterIfNotAlphaNumeric(documentType)} />}
      </Grid>
    </td>
  );
};
