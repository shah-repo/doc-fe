import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../../../common/utils/date';
import { EditableEquipmentItem } from '../../../interface';
import { isEditEquipItem } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

const ExpiryDateCellTemplate: ComponentType<CustomTreeListCellProps> = (props) => {
  const {
    dataItem,
    field,
    hasChildren,
  } = props;
  const classes = styles({ hasChildren });
  const isEditMode = isEditEquipItem(dataItem);
  const { values } = useFormikContext<EditableEquipmentItem>();
  const fieldValue = isEditMode ? values[field ?? ''] : field && dataItem[field];
  const isExpired = true;

  return (
    <TreeListCellWrapper {...props}>
      <span className={cx(classes.Cell, { [classes.expired]: isExpired && fieldValue })}>
        {fieldValue && getFormattedDateString(fieldValue, MomentFormats.MonthDateYearTwoDigit)}
      </span>
    </TreeListCellWrapper>
  );
};

export default ExpiryDateCellTemplate;
