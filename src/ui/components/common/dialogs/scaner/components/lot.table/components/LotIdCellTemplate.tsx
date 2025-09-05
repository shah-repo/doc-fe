import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const classes = useStyles();
  const options = [{ label: dataItem[field]?.name, value: dataItem[field]?.id }];

  return (
    <FormikField name={field}>
      <Autocomplete
        classes={{ option: classes.option }}
        disableClearable
        placeholder={translate('common.scan')}
        options={options}
        data-cy="lot-id-field"
        value={options[0]}
        disabled
        getOptionLabel={(option) => option?.label ?? ''}
        size="small"
      />
    </FormikField>
  );
};
