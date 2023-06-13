import React, { ChangeEvent } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { CompanyLocation, LotTransfer } from '../types';

interface Props extends CellTemplateProps<LotTransfer> {
  locations: CompanyLocation[]
}
export const LocationCellTemplate: React.FC<Props> = ({ dataIndex, dataItem, field, locations, onChange }) => {
  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit)
  );

  const handleChange = (event: ChangeEvent<unknown>, value: CompanyLocation[]) => {
    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value,
    });
  };

  const location = locations.find((loc) => loc.id === dataItem[field]);

  if (isEditMode) {
    return (
      <FormField>
        <Autocomplete
          blurOnSelect
          value={location}
          options={locations}
          getOptionLabel={(option: CompanyLocation) => option.name}
          onChange={handleChange}
        />
      </FormField>
    );
  }

  return <>{location ? location.name : '-'}</>;
};
