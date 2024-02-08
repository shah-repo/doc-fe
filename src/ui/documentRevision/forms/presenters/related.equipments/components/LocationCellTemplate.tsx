import React from 'react';
import { CustomTemplateProps } from '../types';
import { EquipmentLocation } from '../../../../../../state/ducks/company/types';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';
import OverflowContent from '../../../../../components/OverflowContent';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';

interface Props extends CustomTemplateProps {
  options: EquipmentLocation[]
}

const getOptionLabel = (option: EquipmentLocation) => option.name;

export const LocationCellTemplate: React.FC<Props> = (props) => {
  const { options, dataItem, field } = props;

  const renderStoredValue = () => {
    const value = options?.find(item => item.id === dataItem[field]);

    if (!value) {
      return EMPTY_VALUE_PLACEHOLDER;
    }

    const displayValue = getOptionLabel(value);

    return (
      <OverflowContent title={displayValue}>
        {displayValue}
      </OverflowContent>
    );
  };

  return (
    <AutocompleteCellTemplate
      getOptionLabel={getOptionLabel}
      renderStoredValue={renderStoredValue}
      {...props}
    />
  );
};
