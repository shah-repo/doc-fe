import cx from 'classnames';
import React from 'react';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { isDateOverdue } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

export const DateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, hasChildren, onClick } = props;
  const displayValue = dataItem[field];
  const isExpired = displayValue ? isDateOverdue(displayValue) : false;
  const classes = styles({ hasChildren });

  return (
    <TreeListCellWrapper {...props}>
      <OverflowTooltip
        title={displayValue}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{displayValue}</span>
      </OverflowTooltip>
    </TreeListCellWrapper>
  );
};
