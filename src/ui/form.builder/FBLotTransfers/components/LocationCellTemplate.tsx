import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CompanyLocation, CustomTemplateProps, EditableLotTransfer } from '../types';

interface Props extends CustomTemplateProps {
  locations: CompanyLocation[]
}

export const LocationCellTemplate: React.FC<Props> = ({ dataItem, field, locations }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: CompanyLocation) => {
    setFieldValue(field, value?.id);
  };

  const defaultValue = (isEditMode ? values[field] : dataItem[field]) as string;
  const value = locations.find((loc) => loc.id === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name={field}
        required={field === 'from'}
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          options={locations.filter(loc => loc.active)}
          getOptionLabel={(option: CompanyLocation) => option.name}
          value={value}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{value?.name ?? EMPTY_VALUE_PLACEHOLDER}</>;
};
