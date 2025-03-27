import { get } from 'lodash';
import React from 'react';
import { Attachment } from '../../../../change.request/form/types';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../KendoDataGrid/KendoDataGrid.types';

const FileExtensionCellTemplate: React.FC<CellTemplateProps<Attachment>> = (props) => {
  const { dataItem, field } = props;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <div>{displayValue}</div>
  );
};

export default FileExtensionCellTemplate;
