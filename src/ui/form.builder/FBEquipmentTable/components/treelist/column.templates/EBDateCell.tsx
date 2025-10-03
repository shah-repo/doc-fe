import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { MomentFormats, useDate } from '../../../../../../common/utils/date';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { isDateOverdue } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

export const EBDateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, hasChildren, onClick, equipmentOptions } = props;
  const [displayValue, setDisplayValue] = useState<string>();
  const isExpired = displayValue ? isDateOverdue(displayValue) : false;
  const classes = styles({ hasChildren });
  const { getFormattedDateString } = useDate();

  const getFormattedDate = (date) => {
    return date ? getFormattedDateString(date, MomentFormats.MonthDateYearTwoDigit) : '-';
  };

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === dataItem?.equipmentId);
    value && setDisplayValue(getFormattedDate(value?.[field]));
  }, [equipmentOptions]);

  return (
    <TreeListCellWrapper {...props}>
      <OverflowTooltip title={displayValue} placement="top" onClick={() => onClick?.({ dataItem })} interactive arrow>
        <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{displayValue}</span>
      </OverflowTooltip>
    </TreeListCellWrapper>
  );
};
