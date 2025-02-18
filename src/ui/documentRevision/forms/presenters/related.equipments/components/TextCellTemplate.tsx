import { get } from 'lodash';
import React from 'react';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../../components/OverflowContent';
import { CustomTemplateProps } from '../types';

const SyncCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;

  const value = String(get(dataItem, field ?? '') ?? '');

  if (!value) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  return (
    <OverflowContent title={value} onClick={handleClick}>
      {value}
    </OverflowContent>
  );
};

export default SyncCellTemplate;
