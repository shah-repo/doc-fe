import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { CustomTemplateProps } from '../types';
import { translate } from '../../../../../../common/intl';
import { EditableLHRBuild, FBLHRBuildOptions } from '../../../panels/LHRBuild/types';
import OverflowTooltip from '../../../../../components/OverflowTooltip';

function Editor<T>(props: CustomTemplateProps): JSX.Element {
  const { dataItem, field } = props;
  const mode = get(dataItem, MODE_FIELD);
  const { values, setFieldValue, getFieldProps, errors } = useFormikContext<EditableLHRBuild>();
  const lhrBuilds = Object.keys(FBLHRBuildOptions).map((key) => key);

  const handleChange = (event: ChangeEvent<unknown>, value: T) => {
    setFieldValue(field, value);
  };

  return (
    <FormikField name={field} error={get(errors, field)}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        placeholder={translate('validator.lhr.select.internal.type')}
        blurOnSelect
        disableClearable
        options={lhrBuilds}
        onChange={handleChange}
        size="small"
        disabled={mode === Mode.edit}
      />
    </FormikField>
  );
}

export const AutocompleteCellTemplate = (props: CustomTemplateProps): JSX.Element => {
  const { dataItem } = props;
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = mode === Mode.edit || mode === Mode.add;
  const defaultValue = dataItem.internalType;

  if (canBeModified) {
    return <Editor {...props} />;
  }

  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
      style={{ verticalAlign: 'middle' }}
    >
      {defaultValue}
    </OverflowTooltip>
  );
};
