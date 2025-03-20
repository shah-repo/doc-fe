import { makeStyles } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { formatNumberToCurrency } from '../../../dashboard.new/line.items/common/Utils';
import { currencyMappings } from '../../FormattedNumber';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

const useStyles = makeStyles({
  formattedCurrency: {
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  },
});

export const POAmountWithCurrency: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field = '',
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const classes = useStyles();
  if (rowType === 'groupHeader') {
    return null;
  }

  const value = get(dataItem, field);
  const formattedValue = !value || value === 'NULL' ? formatNumberToCurrency(0) : value;

  const cellClickEvent = () => cellRowClick?.({ dataItem });
  const hasSARSymbol = Object.values(currencyMappings).includes(formattedValue.charAt(0));

  return (
    <td
      colSpan={colSpan}
      style={{ ...style, textAlign: 'right' }}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Tooltip data={formattedValue} customClass={cx({ [classes.formattedCurrency]: hasSARSymbol })} />
    </td>
  );
};
