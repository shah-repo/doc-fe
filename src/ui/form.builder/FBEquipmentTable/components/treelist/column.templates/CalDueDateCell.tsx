import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { memo, useEffect, useState } from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../../../common/utils/date';
import { EditableEquipmentItem } from '../../../interface';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { customEQOptionType, CustomTreeListCellProps } from './types';

const CalDueDateCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, equipmentOptions } = props;
  const classes = styles({ hasChildren });
  const { values } = useFormikContext<EditableEquipmentItem>();

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === (dataItem.title ?? values.title));

    if (value && field) {
      setValue(value);
    }
  }, [equipmentOptions]);

  const [value, setValue] = useState<customEQOptionType>();
  const complianceDueDate = value?.complianceDueDate;
  const formattedComplianceDueDate
    = complianceDueDate && getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearTwoDigit);

  const isExpired = complianceDueDate ? new Date(complianceDueDate) < new Date() : false;

  return (
    <TreeListCellWrapper {...props}>
      <span className={cx(classes.Cell, { [classes.expired]: isExpired && complianceDueDate })}>
        {formattedComplianceDueDate}
      </span>
    </TreeListCellWrapper>
  );
};

export default memo(CalDueDateCell);
