import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { memo, useEffect, useState } from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../../../common/utils/date';
import { EditableEquipmentItem } from '../../../interface';
import { isDateOverdue } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { customEQOptionType, CustomTreeListCellProps } from './types';

const CalDueDateCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, equipmentOptions } = props;
  const classes = styles({ hasChildren });
  const { values } = useFormikContext<EditableEquipmentItem>();
  const [value, setValue] = useState<customEQOptionType>();
  const title = dataItem.title ?? values.title;

  useEffect(() => {
    if (!field || !equipmentOptions?.length || !title) return;

    const matchedOption = equipmentOptions.find((option) => option.value === title);

    if (matchedOption) {
      setValue(matchedOption);
    }
  }, [equipmentOptions, title]);

  const complianceDueDate = value?.complianceDueDate;
  const formattedComplianceDueDate = complianceDueDate
    ? getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearTwoDigit)
    : '';
  const isExpired = complianceDueDate ? isDateOverdue(complianceDueDate) : false;

  return (
    <TreeListCellWrapper {...props}>
      <span className={cx(classes.Cell, { [classes.expired]: isExpired })}>{formattedComplianceDueDate}</span>
    </TreeListCellWrapper>
  );
};

export default memo(CalDueDateCell);
