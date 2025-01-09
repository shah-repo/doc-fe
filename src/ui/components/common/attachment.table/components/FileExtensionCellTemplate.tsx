import { get } from 'lodash';
import React from 'react';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';

const FileExtensionCellTemplate: React.FC<any> = (props) => {
  const { dataItem, field } = props;
  console.log('----props---', { dataItem, field });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <div>{displayValue}</div>
  );
};

export default FileExtensionCellTemplate;
