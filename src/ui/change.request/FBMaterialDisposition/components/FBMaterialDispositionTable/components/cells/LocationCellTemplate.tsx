import React from 'react';
import { translate } from '../../../../../../../common/intl';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { EMPTY_VALUE_PLACEHOLDER, MD_LOCATION_KEYS_MAPPING } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { isEditMode } from '../../utils';

export const LocationCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const fieldValue = dataItem[field];

  if (isEditMode(dataItem)) {
    return (<>{EMPTY_VALUE_PLACEHOLDER}</>);
  }

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      { fieldValue ? translate(MD_LOCATION_KEYS_MAPPING[fieldValue]) : '' }
    </OverflowingContent>
  );
};
