import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData, VendorData } from '../types';
import { getVendorData } from '../utils';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const UnitsBuyCellTemplate: React.FC<Props> = ({ dataItem }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    const options = getVendorData().map((item: VendorData) => item.unitsBuy);

    return (
      <Autocomplete
        options={options}
        value={dataItem.unitsBuy}
        size="small"
      />

    );
  }

  return <>{dataItem.unitsBuy}</>;
};
