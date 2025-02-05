import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import Tooltip from '../../../components/common/kendo/Tooltip';
import {
  Autocomplete,
  FormikField,
} from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import {
  ASL_STATUS_CLASS_MAPPING,
  EMPTY_VALUE_PLACEHOLDER,
} from '../constants';
import { CustomTemplateProps, EditableProductORService } from '../types';
import useStyles from './Status.styles';

interface CustomOptionType extends OptionType {
  aslStatusId: string
}

const Editor: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
  aslItems,
}) => {
  const { values, getFieldProps, setFieldValue }
    = useFormikContext<EditableProductORService>();
  const aslOptions = aslItems?.map((data: ASLStatus) => {
    return {
      value: data.internalType,
      label: data.displayLabel,
      aslStatusId: data.id,
    };
  });
  const value = aslOptions?.find(
    (option: CustomOptionType) => option.value === values[field],
  );
  const handleChange = (_, value?: CustomOptionType) => {
    setFieldValue(field, value?.value ?? '');
    setFieldValue('aslStatusId', value?.aslStatusId ?? '');
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
        renderOption={(option: CustomOptionType) => (
          <OverflowTooltip arrow placement="top" title={option.label}>
            {option.label}
          </OverflowTooltip>
        )}
        size="small"
      />
    </FormikField>
  );
};

export const ASLCell: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem } = props;
  const defaultValue = dataItem?.aslDisplayLabel ?? dataItem[field];
  const classes = useStyles();

  if ([Mode.add, Mode.edit].includes(dataItem[MODE_FIELD])) {
    return <Editor {...props} />;
  }

  if (defaultValue) {
    return (
      <Tooltip
        data={defaultValue}
        childrenElement={
          <Chip
            size="small"
            className={cx(
              classes.chip,
              classes.aslChipTextOverflow,
              classes[ASL_STATUS_CLASS_MAPPING[defaultValue]],
            )}
            label={defaultValue}
          />
        }
      />
    );
  }
  return <>{EMPTY_VALUE_PLACEHOLDER}</>;
};
