import React from 'react';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import useStyles from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

export const EQStatus: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, hasChildren, onClick } = props;
  const status = dataItem[field];
  const classes = useStyles({ hasChildren });

  return (
    <TreeListCellWrapper {...props}>
      <OverflowTooltip
        title={status}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        <span className={classes.Cell}>{status}</span>
      </OverflowTooltip>
    </TreeListCellWrapper>
  );
};
