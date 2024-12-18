import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

const Editor: React.FC<CustomTemplateProps> = ({ field, units, dataItem }) => {
  const { getFieldProps, values, setFieldValue }
    = useFormikContext<EditableLHRSummaryItem>();

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value);
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={units}
        data-cy={`${field}-field`}
        value={values?.unit ?? dataItem?.unit}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const UnitCell: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = dataItem[field];

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  return (
    <OverflowTooltip
      title={defaultValue}
      onClick={handleClick}
      placement="top"
      interactive
      arrow
    >
      {defaultValue}
    </OverflowTooltip>
  );
};
