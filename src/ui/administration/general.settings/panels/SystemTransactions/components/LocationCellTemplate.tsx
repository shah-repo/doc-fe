import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { CompanyLocation } from '../../../../../../state/ducks/company/types';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { LotTransferType } from '../../../../../form.builder/FBLotTransfers/types';
import useStyles from '../styles';
import { EditableSystemTransactionsRule, LocationField } from '../types';

interface Props extends CellTemplateProps<EditableSystemTransactionsRule> {
  options: CompanyLocation[]
  isActive: boolean
  onLocationChange?: (rule: EditableSystemTransactionsRule, field: LocationField, location?: CompanyLocation) => void
}

export const LocationCellTemplate: React.FC<Props> = ({ dataItem, field, options, isActive, onLocationChange }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext<EditableSystemTransactionsRule>();
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<unknown>, value?: CompanyLocation) => {
    onLocationChange?.(dataItem, field === 'to' ? 'to' : 'from', value);
  };

  const value = dataItem[field] as CompanyLocation;

  const isScrapAction = dataItem.action === LotTransferType.Scrap;
  const isDisabled = field === 'to' && isScrapAction;

  if (isActive) {
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          options={options.filter(loc => loc.active)}
          getOptionLabel={(option: CompanyLocation) => option.name}
          getOptionSelected={(option: CompanyLocation, value: CompanyLocation) => option.id === value.id}
          value={isDisabled ? null : value}
          onChange={handleChange}
          size="small"
          disabled={isDisabled}
          classes={{
            root: classes.inputRoot,
          }}
        />
      </FormikField>
    );
  }

  const displayValue = value ? value.name : EMPTY_VALUE_PLACEHOLDER;

  return (
    <OverflowTooltip
      title={displayValue}
      placement="top"
      interactive
      arrow
    >
      {displayValue}
    </OverflowTooltip>
  );
};
