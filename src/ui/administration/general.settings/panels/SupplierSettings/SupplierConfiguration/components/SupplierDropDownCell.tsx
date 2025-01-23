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
  const editField = `${field}_edit`;

  const handleChange = (event: ChangeEvent<unknown>, value: string) => {
    setFieldValue(editField, value);
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event,
      field,
      value,
    });
  };

  return (
    <FormikField name={editField}>
      <Autocomplete
        {...getFieldProps(editField)}
        blurOnSelect
        disableClearable
        multiple
        getOptionLabel={(option: OptionType) => option.text}
        getOptionSelected={(option: OptionType, value: OptionType) => option.id === value.id}
        placeholder={translate('common.select')}
        options={dataOptions}
        defaultValue={dataItem[editField]}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const SupplierDropDownCell: React.FC<CustomCellProps> = (props) => {
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
