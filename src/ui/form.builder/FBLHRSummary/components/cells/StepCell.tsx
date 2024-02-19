import { Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField, TextField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { MPI_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const StepCell: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const defaultValue = isEditMode ? values.type : dataItem.type;
  const value = MPI_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode && !isEmpty(values)) {
    const stepField = 'step';
    return (<>
      <Grid container spacing={2}>
        <Grid item style={{ width: '30%' }}>
          <FormikField
            name={stepField}
          >
            <TextField
              {...getFieldProps(stepField)}
              defaultValue={undefined}
              fullWidth={false}
              placeholder={translate('lhr.summary.placeholder.enter')}
              type="text"
              size="small"
            />
          </FormikField>
        </Grid>
        <Grid item justify="center" alignItems="center" style={{ paddingTop: 10 }}>/</Grid>
        <Grid item style={{ width: '60%' }}>
          <FormikField
            name={field}
          >
            <Autocomplete
              {...getFieldProps(field)}
              blurOnSelect
              freeSolo
              forcePopupIcon
              disableClearable
              options={MPI_OPTIONS}
              value={value}
              getOptionLabel={(option: OptionType) => option.label}
              onChange={handleChange}
              onInputChange={handleChange}
              placeholder={translate('lhr.summary.placeholder.select.enter')}
              size="small"
            />
          </FormikField>
        </Grid>
      </Grid>
    </>
    );
  }

  return <>{value?.label}</>;
};
