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

function Editor<T>(props: CustomTemplateProps): JSX.Element {
  const { dataItem, field } = props;
  const mode = get(dataItem, MODE_FIELD);
  const { values, setFieldValue, getFieldProps, errors } = useFormikContext<EditableLHRBuild>();
  const lhrBuilds = Object.keys(FBLHRBuildOptions).map((key) => key);
  const otherOptions = Object.keys(FBLHRBuildOtherOptions).map((key) => key);
  const handleChange = (event: ChangeEvent<unknown>, value: T) => {
    setFieldValue(field, value);
  };

  return (
    <FormikField name={field} error={get(errors, field)}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        placeholder={field === 'internalType' ? translate('validator.lhr.select.internal.type') : translate('common.select')}
        blurOnSelect
        disableClearable
        options={field === 'internalType' ? lhrBuilds : otherOptions}
        onChange={handleChange}
        size="small"
        disabled={mode === Mode.edit}
      />
    </FormikField>
  );
}

export const AutocompleteCellTemplate = (props: CustomTemplateProps): JSX.Element => {
  const { dataItem, field } = props;
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = [Mode.edit, Mode.add].includes(mode);
  const defaultValue = dataItem[field];
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
