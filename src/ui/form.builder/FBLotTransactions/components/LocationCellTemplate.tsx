import React, { ChangeEvent } from 'react';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import useStyles from '../../FBApprovalMatrixRoles/styles';
import { CompanyLocation, LotEditEvent, LotTransfer } from '../types';

interface Props extends CellTemplateProps<LotTransfer> {
  locations: CompanyLocation[]
  onClick?: (e: LotEditEvent) => void
}
export const LocationCellTemplate: React.FC<Props> = ({ dataItem, field, locations, onClick }) => {
  const classes = useStyles();

  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit)
  );

  const placeholder = dataItem[field].length === 0 ? 'location' : undefined;

  const handleClick = () => onClick?.({ dataItem });

  const handleChange = (event: ChangeEvent<unknown>, value: CompanyLocation[]) => {
    onChange?.({
      dataItem,
      syntheticEvent: event,
      value,
    });
  };

  if (isEditMode) {
    return (
      <FormField>
        <Autocomplete
          placeholder={placeholder}
          value={dataItem}
          options={locations}
          getOptionLabel={(option: CompanyLocation) => option.name}
          getOptionSelected={(option: CompanyLocation, value: CompanyLocation) => option.id === value.id}
          onChange={handleChange}
          multiple
        />
      </FormField>
    );
  }
  const location = locations.find((loc) => loc.id === dataItem[field]);
  return <>{location ? location.name : '-'}</>;
};
