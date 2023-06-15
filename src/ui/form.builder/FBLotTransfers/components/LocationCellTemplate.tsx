import React, { ChangeEvent } from 'react';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CompanyLocation, CustomTemplateProps } from '../types';

interface Props extends CustomTemplateProps {
  locations: CompanyLocation[]
}

export const LocationCellTemplate: React.FC<Props> = ({ dataIndex, dataItem, field, locations, onChange }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: CompanyLocation) => {
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

  return <>{location?.name ?? EMPTY_VALUE_PLACEHOLDER}</>;
};
