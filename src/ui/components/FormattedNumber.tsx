import { UnifiedNumberFormatOptions } from '@formatjs/intl-unified-numberformat';
import React from 'react';
import {
  CustomFormatConfig,
  FormattedNumber as NumberFormatter,
} from 'react-intl';

type Props = UnifiedNumberFormatOptions &
CustomFormatConfig & { value: number };
const SwissFrancsCurrencyValue = 'CHF';
const SwissFrancsCurrencySymbol = '₣';

const FormattedNumber: React.FC<Props> = (props) => (
  <NumberFormatter {...props}>
    {(parts: string) => {
      return (
        <>
          {parts?.includes(SwissFrancsCurrencyValue)
            ? `${SwissFrancsCurrencySymbol}${parts.replace(`${SwissFrancsCurrencyValue}`, '').trim()}`
            : parts}
        </>
      );
    }}
  </NumberFormatter>
);

export default FormattedNumber;
