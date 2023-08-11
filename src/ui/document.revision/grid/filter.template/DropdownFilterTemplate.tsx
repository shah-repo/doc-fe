import React from 'react';
import { intl } from '../../../../common/intl';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import DropdownFilter from '../../../form.builder/FBApprovalMatrix/components/DropdownFilter';
import { DropdownFilterCellProps } from '../../../form.builder/FBApprovalMatrix/components/DropdownFilter/types';

const LotStatusFilterTemplate: React.FC<DropdownFilterCellProps> = (props) => {
  const {
    data,
    value,
    defaultItem,
    onChange,
  } = props;

  const hasValue = (value) => value && value !== defaultItem;

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  return (
    <div className="k-filtercell" >
      <DropdownFilter
        {...props}
        data={data}
        defaultItem={defaultItem}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        disabled={!hasValue(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};

export default LotStatusFilterTemplate;
