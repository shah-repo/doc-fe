import { get } from 'lodash';
import React from 'react';
import { EquipmentLocation } from '../../../../../../state/ducks/company/types';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../../components/OverflowContent';
import { CustomTemplateProps } from '../types';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';

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
