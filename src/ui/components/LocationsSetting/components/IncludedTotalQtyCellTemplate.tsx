import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { EditableCompanyLocation } from '../../../administration/general.settings/panels/CompanyLocations/types';
import { ACTION_NEEDED_OPTIONS, EMPTY_VALUE_PLACEHOLDER } from '../../../form.builder/FBCycleCount/constants';
import { CellTemplateProps } from '../../KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../forms/fields-next';
import { OptionType } from '../../forms/fields/Autocomplete/types';

export const IncludedTotalQtyCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field, onClick }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableCompanyLocation>();
  const value = ACTION_NEEDED_OPTIONS.find((option) => option.value === values[field]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };
  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <Box display="flex" justifyContent="center">
      {isEditMode && (
        <FormikField name={field}>
          <Autocomplete
            {...getFieldProps(field)}
            key={isEmpty(values) ? 'disabled' : 'enabled'}
            blurOnSelect
            disableClearable
            options={ACTION_NEEDED_OPTIONS}
            value={value}
            getOptionLabel={(option: OptionType) => option.label}
            onChange={handleChange}
          />
        </FormikField>
      )}
      {!isEditMode && (
        <div
          onClick={handleClick}
        >
          {displayValue}

        </div>
      )}
    </Box>
  );
};
