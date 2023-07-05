import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete } from '../../../components/forms/fields-next';
import FBData from '../../FBData/FBData';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {}

const getOptionLabel = (option) => option.value;
export const UnitsBuyCellTemplate: React.FC<Props> = ({ dataItem }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return (
      <Autocomplete
        blurOnSelect
        options={FBData.productUnitsOptions}
        getOptionLabel={getOptionLabel}
        size="small"
      />
    );
  }

  return <>{dataItem.unitsBuy}</>;
};
