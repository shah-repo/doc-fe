import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../../../../components/KendoDataGrid/constants';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { EMPTY_VALUE_PLACEHOLDER, MD_LOCATION_KEYS_MAPPING } from '../../constants';
import { CustomTemplateProps } from '../../types';

export const LocationCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const fieldValue = dataItem[field];
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return (<>{EMPTY_VALUE_PLACEHOLDER}</>);
  }

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      { fieldValue ? translate(MD_LOCATION_KEYS_MAPPING[fieldValue]) : '' }
    </OverflowingContent>
  );
};
