import { useFormikContext } from 'formik';
import React from 'react';
import {
  EMPTY_VALUE_PLACEHOLDER,
  Mode,
  MODE_FIELD,
} from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { CustomTemplateProps, EditableReference } from '../types';

export const ReadOnlyCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
  onClick,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const formik = useFormikContext<EditableReference>();
  const displayValue = isEditMode ? formik?.values[field] || dataItem[field] : dataItem[field];
  const handleClick = () => onClick?.({ dataItem });

  return (
    <OverflowContent onClick={handleClick}>
      {displayValue ?? EMPTY_VALUE_PLACEHOLDER}
    </OverflowContent>
  );
};
