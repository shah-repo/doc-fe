import * as React from 'react';
import { translate } from '../../../../common/intl';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';

interface FilterWrapperProps {
  hasValue: string | boolean
  onClear: (event: React.MouseEvent<HTMLElement>) => void
  children: React.ReactNode
}

const FilterWrapper = ({ hasValue, onClear, children }: FilterWrapperProps) => {
  return (
    <div className="k-filtercell">
      {children}

      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={translate(TranslatedText[DisplayText.CLEAR])}
        disabled={!hasValue}
        onClick={onClear}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};

export default FilterWrapper;
