import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { EditableLHRBuildSwitch } from '../types';
import { translate } from '../../../../../../common/intl';
import { EditableLHRBuild, LHRBuild } from '../../LHRBuild/types';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { createStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';

const useStyles = makeStyles(() =>
  createStyles({
    tooltip: {
      verticalAlign: 'middle',
    },
  }),
);

interface Props extends CellTemplateProps<EditableLHRBuildSwitch> {
  options: LHRBuild[]
}

const AutocompleteCellTemplate: React.FC<Props> = ({
  dataItem,
  field,
  options,
}) => {
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = [Mode.edit, Mode.add].includes(mode);
  const { values, setFieldValue, getFieldProps, errors } = useFormikContext<EditableLHRBuild>();
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<unknown>, value: LHRBuild) => {
    setFieldValue(field, value.id);
  };

  const defaultValue = options.find(val => val.id === dataItem[field]);

  if (canBeModified) {
    return (
    <FormikField name={field} error={get(errors, field)}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        placeholder={translate('common.select')}
        value={defaultValue}
        blurOnSelect
        disableClearable
        options={options}
        onChange={handleChange}
        getOptionLabel={(val: LHRBuild) => val.displayLabel}
        size="small"
      />
    </FormikField>
  );
  }

  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
      className={classes.tooltip}
    >
      {defaultValue?.displayLabel}
    </OverflowTooltip>
  );
};

export default AutocompleteCellTemplate;
