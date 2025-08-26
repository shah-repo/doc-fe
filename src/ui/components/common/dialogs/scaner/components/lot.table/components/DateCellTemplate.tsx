import cx from 'classnames';
import React, { memo } from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../../../../../common/utils/date';
import OverflowContent from '../../../../../../OverflowContent';
import { EMPTY_CELL } from '../constants';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

const DateCellTemplate: React.ComponentType<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const classes = useStyles();

  const complianceDueDate = dataItem[field];
  const formattedComplianceDueDate = complianceDueDate
    ? getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearTwoDigit)
    : EMPTY_CELL;

  const isExpired = complianceDueDate ? new Date(complianceDueDate) < new Date() : false;
  const handleClick = () => onClick?.({ dataItem });

  return (
    <OverflowContent onClick={handleClick}>
      <span className={cx({ [classes.expired]: isExpired })}>{formattedComplianceDueDate}</span>
    </OverflowContent>
  );
};

export default memo(DateCellTemplate);
