import { get } from 'lodash';
import React from 'react';
import OverflowContent from '../../../../components/OverflowContent';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const TextInputCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem } = props;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent>
      {displayValue}
    </OverflowContent>
  );
};
