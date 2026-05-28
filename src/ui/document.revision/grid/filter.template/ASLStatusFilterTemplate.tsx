import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { isEmpty } from 'lodash';
import React, { MouseEvent, useContext, useMemo } from 'react';
import { translate } from '../../../../common/intl';
import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import { Autocomplete } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { DocTypeTableContext } from '../../../documentType/grid/interfaces';
import FilterWrapper from './FilterWraper';
import useStyles from './styles';

interface Props extends GridFilterCellProps {
  defaultItem: string
}

interface CustomOptionType extends OptionType {
  aslStatusId: string
}

export const ASLStatusFilterTemplate = ({ defaultItem, onChange, value }: Props) => {
  const hasValue = (value: string) => value && value !== defaultItem;
  const classes = useStyles();
  const onDropdownChange = (syntheticEvent, target?: CustomOptionType) => {
    const isValueExists = hasValue(target?.aslStatusId ?? '');
    onChange({
      value: isValueExists ? target?.aslStatusId : '',
      operator: isValueExists ? 'eq' : '',
      syntheticEvent,
    });
  };

  const onClearButtonClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  const docTypeTableContext = useContext(DocTypeTableContext);

  const aslOptions = useMemo(
    () =>
      (docTypeTableContext?.aslStatuses || []).map((data: ASLStatus) => ({
        value: data.internalType,
        label: data.displayLabel,
        aslStatusId: data.id,
        isActive: data.isActive,
      })),
    [docTypeTableContext?.aslStatuses],
  );
  const defaultValue = { label: defaultItem, value: '' };
  const filteredAslOptions = [defaultValue, ...aslOptions];
  const updatedValue = aslOptions?.find((option) => option.aslStatusId === value) ?? defaultValue;

  return (
    <FilterWrapper hasValue={hasValue(value)} onClear={onClearButtonClick}>
      <Autocomplete
        key={isEmpty(filteredAslOptions) ? 'disabled' : 'enabled'}
        blurOnSelect
        className={classes.statusDropDown}
        disableClearable
        placeholder={translate('common.select')}
        options={filteredAslOptions}
        value={updatedValue}
        getOptionLabel={(option: CustomOptionType) => option.label}
        onChange={onDropdownChange}
        renderOption={(option: CustomOptionType) => (
          <OverflowTooltip arrow placement="top" title={option.label}>
            {option.label}
          </OverflowTooltip>
        )}
        size="small"
      />
    </FilterWrapper>
  );
};
