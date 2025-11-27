import cx from 'classnames';
import React, { memo } from 'react';
import { MomentFormats, useDate } from '../../../../../../../../common/utils/date';
import OverflowContent from '../../../../../../OverflowContent';
import { EMPTY_CELL_VALUE } from '../../../../../treelist/constants';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

const DateCellTemplate: React.ComponentType<CustomTemplateProps> = ({ field, dataItem }) => {
  const classes = useStyles();
  const complianceDueDate = dataItem[field];
  const { getFormattedDateString } = useDate();
  const formattedComplianceDueDate = complianceDueDate
    ? getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearTwoDigit)
    : EMPTY_CELL_VALUE;

  const isExpired = complianceDueDate ? new Date(complianceDueDate) < new Date() : false;

  return (
    <OverflowContent>
      <span className={cx({ [classes.expired]: isExpired })}>{formattedComplianceDueDate}</span>
    </OverflowContent>
  );
};

export default memo(DateCellTemplate);
