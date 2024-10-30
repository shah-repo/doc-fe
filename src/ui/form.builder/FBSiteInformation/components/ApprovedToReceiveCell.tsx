import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { APPROVED_TO_RECEIVE_OPTIONS } from '../constants';
import { CustomSiteTemplateProps } from '../types';
const Editor: React.FC<CustomSiteTemplateProps> = ({
  dataItem,
  dataIndex,
  field,
  onChange,
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const handleChange = (e, value: OptionType) => {
    setFieldValue(field, value.value);
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: e.syntheticEvent,
      field,
      value: value.value,
    });
  };

  const value
    = APPROVED_TO_RECEIVE_OPTIONS.find(
      (option) => option.value === dataItem[field],
    ) ?? APPROVED_TO_RECEIVE_OPTIONS[0];

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={APPROVED_TO_RECEIVE_OPTIONS}
        data-cy={`${kebabCase(field)}-field`}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};
export const ApprovedToReceiveCell: React.FC<CustomSiteTemplateProps> = (
  props,
) => {
  const { field, dataItem, onClick } = props;
  const isEditMode
    = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = `${kebabCase(field)}-td`;

  if (isEditMode) {
    return <Editor {...props} />;
  }
  const displayValue
    = APPROVED_TO_RECEIVE_OPTIONS?.find(
      (option) => option.value === dataItem?.[field],
    );

  return (
    <Box display="flex" justifyContent="center" onClick={handleClick} data-cy={dataCy}>
      {displayValue?.label}
    </Box>
  );
};
