import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../../forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER, Mode, MODE_FIELD } from '../../../../../../KendoDataGrid/constants';
import OverflowTooltip from '../../../../../../OverflowTooltip';
import { CustomTemplateProps, EditableScanLot } from '../types';
import useStyles from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  const { values, getFieldProps } = useFormikContext<EditableScanLot>();
  const classes = useStyles();
  const options = [{ label: values[field]?.name, value: values[field]?.id }];

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        classes={{ option: classes.option }}
        blurOnSelect
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

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = dataItem[field]?.name || EMPTY_VALUE_PLACEHOLDER;

  return (
    <OverflowTooltip
      title={displayValue}
      placement="top"
      interactive
      arrow
      onClick={handleClick}
      data-cy={`${kebabCase(field)}-cell`}
    >
      {displayValue}
    </OverflowTooltip>
  );
};
