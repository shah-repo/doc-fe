import React from 'react';
import { translate } from '../../../../../../../common/intl';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { MD_LOCATION_KEYS_MAPPING } from '../../constants';
import { CustomTemplateProps } from '../../types';

export const LocationCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const fieldValue = dataItem[field];

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      { fieldValue ? translate(MD_LOCATION_KEYS_MAPPING[fieldValue]) : '' }
    </OverflowingContent>
  );
};
