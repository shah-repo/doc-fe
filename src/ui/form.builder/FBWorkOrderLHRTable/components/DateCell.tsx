import { useFormikContext } from 'formik';
import React from 'react';
import { Mode, MODE_FIELD } from '../constants';
import { CustomTemplateProps, EditableLHRTableItem } from '../types';

export const DateCell: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { values } = useFormikContext<EditableLHRTableItem>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const dateValue = (isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) as string;

  return (<>{ dateValue }</>);
};
