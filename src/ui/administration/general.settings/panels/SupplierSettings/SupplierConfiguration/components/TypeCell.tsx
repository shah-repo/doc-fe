import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { CustomCellProps, OptionType } from '../types';

const Editor: React.FC<CustomCellProps> = ({
  dataItem,
  dataIndex,
  field,
  dataOptions,
  onChange,
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const defaultValue = dataItem[field] as string;
  const value = dataOptions?.find((data) => data.text === defaultValue);
  const isEditMode = Mode.edit === dataItem[MODE_FIELD];

  const handleChange = (event: ChangeEvent<unknown>, value: OptionType) => {
    setFieldValue(field, value.text);
    setFieldValue('supplierTypeId', value.id);

    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event,
      field,
      value,
    });
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        disabled={isEditMode}
        getOptionLabel={(option: OptionType) => option.text}
        getOptionSelected={(option: OptionType, value) => option.text === value}
        placeholder={translate('common.select')}
        options={dataOptions}
        value = {value}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const TypeCell: React.FC<CustomCellProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = kebabCase(field);
  const displayValue = dataItem[field];

  return (
    <Box display="flex" justifyContent="start" data-cy={`${dataCy}-td`} onClick={handleClick}>
      {isEditMode && <Editor {...props} />}
      {!isEditMode && (
        <OverflowTooltip
          arrow
          placement="top"
          title={displayValue}
          onClick={handleClick}
          data-cy={`${dataCy}-value`}
        >
          {displayValue}
        </OverflowTooltip>
      )}
    </Box>
  );
};
