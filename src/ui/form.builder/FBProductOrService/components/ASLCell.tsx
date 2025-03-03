import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import useCommonStatusStyles from '../../../../../src/ui/components/common/kendo.column.templates/Status.styles';
import { translate } from '../../../../common/intl';
import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
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
      isActive: data.isActive,
    };
  });
  const value = aslOptions?.find(
    (option: CustomOptionType) => option.value === values[field],
  );
  const filteredAslOptions = aslOptions?.filter(data => data.isActive);

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
        options={filteredAslOptions}
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
  const statusClass = dataItem?.aslStatus ?? defaultValue;
  const classes = useStyles();
  const statusClasses = useCommonStatusStyles();

  if ([Mode.add, Mode.edit].includes(dataItem[MODE_FIELD])) {
    return <Editor {...props} />;
  }

  if (defaultValue) {
    return (
      <OverflowTooltip arrow placement="top" title={defaultValue}>
        <Chip
          size="small"
          className={cx(
            statusClasses.chip,
            classes.aslChipTextOverflow,
            statusClasses[ASL_STATUS_CLASS_MAPPING[statusClass]],
          )}
          label={defaultValue}
        />
      </OverflowTooltip>
    );
  }
  return <>{EMPTY_VALUE_PLACEHOLDER}</>;
};
