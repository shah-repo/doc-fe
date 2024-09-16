import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import Tooltip from '../../../components/common/kendo/Tooltip';
import {
  Autocomplete,
  FormikField,
} from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import {
  Mode, MODE_FIELD,
} from '../../../components/KendoDataGrid/constants';
import { ASL_STATUS_CLASS_MAPPING, EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableProductORService } from '../types';
import useStyles from './Status.styles';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem, aslItems }) => {
  const aslOptions = aslItems?.map((data) => { return { value: data.id, label: data.displayLabel }; });
  let value = aslOptions?.find((option) => option.value === dataItem[field]);
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableProductORService>();
  value = aslOptions?.find((option) => option.value === values[field]);
  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value ?? '');
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={aslOptions}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const ASLCell: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem } = props;
  const defaultValue = dataItem[field];
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  if (defaultValue) {
    return <Tooltip
      data={defaultValue}
      childrenElement={
        <Chip
          size="small"
          className={cx(
            classes.chip,
            classes[ASL_STATUS_CLASS_MAPPING[defaultValue]],
          )}
          label={defaultValue}
        />
      }
    />;
  }
  return <>{EMPTY_VALUE_PLACEHOLDER}</>;
};
