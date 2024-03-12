import React from 'react';
import { get } from 'lodash';
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
  const { dataItem, field } = props;

  const renderStoredValue = () => {
    const name = get(dataItem, `${field}.name`) as string;

    if (!name) {
      return EMPTY_VALUE_PLACEHOLDER;
    }

    return (
      <OverflowContent title={name}>
        {name}
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
