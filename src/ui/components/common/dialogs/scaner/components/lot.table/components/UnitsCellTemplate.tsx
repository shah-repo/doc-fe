import React from 'react';
import { Autocomplete } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';

export const UnitsCellTemplate: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  return <div><Autocomplete options={[dataItem[field]]} value={dataItem[field]} size="small" disabled /></div>;
};
