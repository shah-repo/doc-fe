import { useFormikContext } from 'formik';
import React from 'react';
import {
  getFormattedDateString,
  MomentFormats,
} from '../../../../common/utils/date';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, EditableReference } from '../types';

export const DateCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const formik = useFormikContext<EditableReference>();
  let fieldValue = dataItem[field];

  if (isEditMode) {
    fieldValue = formik?.values.status || fieldValue;
  }

  const value = fieldValue && getFormattedDateString(
    fieldValue,
    MomentFormats.MonthDateYearTwoDigit,
  );

  return <>{value}</>;
};
