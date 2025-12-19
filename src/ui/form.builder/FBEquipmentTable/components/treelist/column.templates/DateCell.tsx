import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import Text from '../../../../../components/Text';
import { getValidDueDate, isDateOverdue } from '../utils';
import useStyles from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

export const DateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, hasChildren, onClick } = props;
  const isExpired = dataItem[field] ? isDateOverdue(dataItem[field]) : false;
  const updatedDate = getValidDueDate(dataItem[field]);
  const classes = useStyles({ hasChildren });

  return (
    <TreeListCellWrapper {...props}>
      <OverflowTooltip
        title={updatedDate}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{updatedDate}</span>
        {isExpired && (<span>
          <FontAwesomeIcon
            size="lg"
            className={cx(classes.expired, classes.expiredIcon)}
            icon={ solid('circle-exclamation')}
          />
          <Typography component="span" variant="h5" className={cx(classes.expired, classes.overdueLabel)} >
            <Text translation="common.overdue" />
          </Typography>
        </span>)}
      </OverflowTooltip>
    </TreeListCellWrapper>
  );
};
