import cx from 'classnames';
import React, { memo } from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../../../../../common/utils/date';
import OverflowContent from '../../../../../../OverflowContent';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

const DateCellTemplate: React.ComponentType<CustomTemplateProps> = ({ field, dataItem }) => {
  const classes = useStyles();
  const complianceDueDate = dataItem[field];
  const formattedComplianceDueDate = complianceDueDate
    ? getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearTwoDigit)
    : '-';

  const isExpired = complianceDueDate ? new Date(complianceDueDate) < new Date() : false;

  return (
    <OverflowContent>
      <span className={cx({ [classes.expired]: isExpired })}>{formattedComplianceDueDate}</span>
    </OverflowContent>
  );
};

export default memo(DateCellTemplate);
