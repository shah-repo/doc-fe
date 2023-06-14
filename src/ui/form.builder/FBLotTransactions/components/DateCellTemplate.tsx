import React, { ChangeEventHandler } from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import DateFormatter from '../../../components/Date';
import { FormField } from '../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import FBDatePicker from '../../FBDatePicker/FBDatePicker';
import { LotTransfer } from '../types';

export const DateCellTemplate: React.FC<CellTemplateProps<LotTransfer>> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
}) => {
  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit)
  );

  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    const value = event.target.value;

    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value,
    });
  };

  return isEditMode ? (
    <FormField >
      <FBDatePicker />
    </FormField>
  ) : (
    <DateFormatter value={dataItem.date} format={MomentFormats.MonthDateYearTwoDigit} />
  );
};
