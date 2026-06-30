import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get, kebabCase } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { CustomCellProps, OptionType } from '../types';

const Editor: React.FC<CustomCellProps> = ({
  dataItem,
  dataIndex,
  field,
  dataOptions,
  onChange,
}) => {
  const { getFieldProps, setFieldValue, errors } = useFormikContext();
  const value = dataOptions?.find(
    (data: OptionType) => data.text === dataItem[field],
  );
  const handleChange = (event: ChangeEvent<unknown>, value: OptionType & {category: string}) => {
    setFieldValue(field, value.text);
    setFieldValue('documentTypeId', value.id);
    setFieldValue('category', value.category);

    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event,
      field,
      value,
    });
  };

  return (
    <FormikField name={field} error={get(errors, field)}>
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        disabled={Mode.edit === dataItem[MODE_FIELD]}
        getOptionLabel={(option: OptionType) => option.text}
        getOptionSelected={(option: OptionType, value) => option.text === value}
        placeholder={translate('common.select')}
        options={dataOptions}
        value={value}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const DocumentTypeCell: React.FC<CustomCellProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = kebabCase(field);

  if ([Mode.add, Mode.edit].includes(dataItem[MODE_FIELD])) {
    return <Editor {...props} />;
  }

  return (
    <Box
      display="flex"
      justifyContent="start"
      data-cy={`${dataCy}-td`}
      onClick={handleClick}
    >
      <OverflowTooltip
        arrow
        placement="top"
        title={dataItem[field]}
        onClick={handleClick}
        data-cy={`${dataCy}-value`}
      >
        {dataItem[field]}
      </OverflowTooltip>
    </Box>
  );
};
