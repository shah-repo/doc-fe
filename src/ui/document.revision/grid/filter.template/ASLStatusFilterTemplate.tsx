import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { isEmpty } from 'lodash';
import React, { MouseEvent, useContext, useMemo } from 'react';
import { translate } from '../../../../common/intl';
import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import { Autocomplete } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { DocTypeTableContext } from '../../../documentType/grid/interfaces';
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
    <div className="k-filtercell">
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
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={translate(TranslatedText[DisplayText.CLEAR])}
        disabled={!hasValue(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
