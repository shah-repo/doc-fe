import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import FBAutocomplete from '../../FBAutocomplete/FBAutocomplete';
import FBData from '../../FBData/FBData';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const UnitsBuyCellTemplate: React.FC<Props> = ({ dataItem }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    // const options = getVendorData().map((item: VendorData) => item.unitsBuy);

    return (
      // <Autocomplete
      //   options={FBData.productUnitsOptions}
      //   value={dataItem.unitsBuy}
      //   size="small"
      // />
      <FBAutocomplete
        name="units"
        options={FBData.productUnitsOptions}
        optionValueKey="value"
        optionLabelKey="text"
      />

    );
  }

  return <>{dataItem.unitsBuy}</>;
};
