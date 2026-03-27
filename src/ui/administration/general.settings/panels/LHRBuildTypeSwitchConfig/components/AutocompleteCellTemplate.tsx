import { makeStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../common/intl';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { LHRBuild } from '../../LHRBuild/types';
import { EditableLHRBuildSwitch } from '../types';

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
  const { values, setFieldValue, getFieldProps, errors } = useFormikContext<EditableLHRBuildSwitch>();
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<unknown>, value: LHRBuild) => {
    setFieldValue(field, value.id);
  };

  const defaultValue = options.find(val => val.id === dataItem[field]);

  if (canBeModified) {
    let filerOptions = options.filter(val => val.isActive);
    if (field === 'from' && !isEmpty(values?.to)) {
      filerOptions = options.filter(item => item.id !== values.to);
    } else if (field === 'to' && !isEmpty(values.from)) {
      filerOptions = options.filter(item => item.id !== values.from);
    }

    return (
      <FormikField name={field} error={get(errors, field)}>
        <Autocomplete
          {...getFieldProps(field)}
          key={isEmpty(values) ? 'disabled' : 'enabled'}
          placeholder={translate('common.select')}
          value={defaultValue}
          blurOnSelect
          disableClearable
          options={filerOptions}
          onChange={handleChange}
          getOptionLabel={(val: LHRBuild) => val.displayLabel}
          size="small"
        />
      </FormikField>
    );
  }

  return (
    <OverflowTooltip
      title={defaultValue?.displayLabel}
      placement="top"
      arrow
      className={classes.tooltip}
    >
      {defaultValue?.displayLabel}
    </OverflowTooltip>
  );
};

export default AutocompleteCellTemplate;
