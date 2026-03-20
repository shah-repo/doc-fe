import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { CustomTemplateProps } from '../types';
import { translate } from '../../../../../../common/intl';
import { EditableLHRBuild, FBLHRBuildOptions, FBLHRBuildOtherOptions } from '../../../panels/LHRBuild/types';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { createStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    tooltip: {
      verticalAlign: 'middle',
    },
  }),
);

const isValueBoolean = (value: unknown): boolean => typeof value === 'boolean';

function Editor<T>(props: CustomTemplateProps): JSX.Element {
  const { dataItem, field } = props;
  const mode = get(dataItem, MODE_FIELD);
  const { values, setFieldValue, getFieldProps, errors } = useFormikContext<EditableLHRBuild>();
  const lhrBuilds = Object.keys(FBLHRBuildOptions).map((key) => key);
  const otherOptions = Object.keys(FBLHRBuildOtherOptions).map((key) => key);
  const handleChange = (event: ChangeEvent<unknown>, value: T) => {
    if([FBLHRBuildOtherOptions.Yes, FBLHRBuildOtherOptions.No].includes(value as unknown as FBLHRBuildOtherOptions)) {
      return setFieldValue(field, String(value) === FBLHRBuildOtherOptions.Yes);
    }
    setFieldValue(field, value);
  };
  let value = dataItem[field];

  if(isValueBoolean(value)) {
    value = value ? FBLHRBuildOtherOptions.Yes : FBLHRBuildOtherOptions.No;
  }

  const isFieldInternalType = field === 'internalType';
  return (
    <FormikField name={field} error={get(errors, field)}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        placeholder={isFieldInternalType ? translate('validator.lhr.select.internal.type') : translate('common.select')}
        blurOnSelect
        disableClearable
        options={isFieldInternalType ? lhrBuilds : otherOptions}
        onChange={handleChange}
        size="small"
        disabled={isFieldInternalType && mode === Mode.edit}
        value={value}
      />
    </FormikField>
  );
}

export const AutocompleteCellTemplate = (props: CustomTemplateProps): JSX.Element => {
  const { dataItem, field } = props;
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = [Mode.edit, Mode.add].includes(mode);
  let defaultValue = dataItem[field];

  if(isValueBoolean(defaultValue)) {
    defaultValue = defaultValue ? FBLHRBuildOtherOptions.Yes : FBLHRBuildOtherOptions.No;
  }

  const classes = useStyles();
  if (canBeModified) {
    return <Editor {...props} />;
  }

  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
      className={classes.tooltip}
    >
      {defaultValue}
    </OverflowTooltip>
  );
};
