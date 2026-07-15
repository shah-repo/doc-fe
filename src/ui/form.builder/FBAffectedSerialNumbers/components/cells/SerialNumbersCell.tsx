import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { CustomTemplateProps } from '../../types';

const Editor: React.FC<CustomTemplateProps> = ({
  dataItem,
  dataIndex,
  field,
  serialNumbers,
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
        getOptionLabel={(option: OptionType) => option.label}
        getOptionSelected={(option: OptionType, value: OptionType) =>
          option.value === value.value
        }
        placeholder={translate('common.select')}
        options={serialNumbers}
        defaultValue={dataItem[editField]}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const SerialNumbersCell: React.FC<CustomTemplateProps> = (props) => {
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
