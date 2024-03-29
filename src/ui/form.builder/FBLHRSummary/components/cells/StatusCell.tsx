import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import { statusClassMapping } from '../../../../components/common/kendo/helpers';
import Tooltip from '../../../../components/common/kendo/Tooltip';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { EMPTY_PLACEHOLDER, STATUS_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import useStyles from './Status.styles';

export const StatusCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();

  const defaultValue = dataItem[field];
  let value = STATUS_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();

    const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
      // {id: 'enter value', revId: selectedValue, isNew: false}
      setFieldValue(field, value?.value ?? value);
    };
    value = STATUS_OPTIONS.find((option) => option.value === values[field]);
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          freeSolo
          forcePopupIcon
          disableClearable
          options={STATUS_OPTIONS}
          value={value}
          getOptionLabel={(option: OptionType) => option.label}
          onChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }
  const displayStatus = value?.label ?? defaultValue;

  return (
    <>
      {displayStatus ? (
        <Tooltip
          data={displayStatus}
          childrenElement={
            <Chip
              size="small"
              className={cx(
                classes.chip,
                classes[statusClassMapping[displayStatus]],
              )}
              label={displayStatus}
            />
          }
        />
      ) : (
        EMPTY_PLACEHOLDER
      )}
    </>
  );
};
