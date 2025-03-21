import { UnifiedNumberFormatOptions } from '@formatjs/intl-unified-numberformat';
import React from 'react';
import {
  CustomFormatConfig,
  FormattedNumber as NumberFormatter,
} from 'react-intl';

type Props = UnifiedNumberFormatOptions &
CustomFormatConfig & { value: number };

const currencyMappings: Record<string, string> = {
  CHF: '₣',
  SGD: 'S$',
  SAR: '﷼',
};

const FormattedNumber: React.FC<Props> = (props) => (
  <NumberFormatter {...props}>
    {(parts: string) => {
      const currencyKey = Object.keys(currencyMappings).find((key) =>
        parts.includes(key),
      );
      return (
        <>
          {currencyKey
            ? `${currencyMappings[currencyKey]}${parts.replace(currencyKey, '').trim()}`
            : parts}
        </>
      );
    }}
  </NumberFormatter>
);

export default FormattedNumber;
