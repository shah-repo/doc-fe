import { UnifiedNumberFormatOptions } from '@formatjs/intl-unified-numberformat';
import { makeStyles } from '@material-ui/core';
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

const useStyles = makeStyles({
  formattedCurrency: {
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  },
});

const FormattedNumber: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <NumberFormatter {...props}>
      {(parts: string) => {
        const currencyKey = Object.keys(currencyMappings).find((key) => parts.includes(key));
        const formattedCurrency = currencyKey
          ? `${currencyMappings[currencyKey]}${parts.replace(currencyKey, '').trim()}`
          : parts;

        return currencyKey === 'SAR' ? (
          <span className={classes.formattedCurrency}>{formattedCurrency}</span>
        ) : (
          <>{formattedCurrency}</>
        );
      }}
    </NumberFormatter>
  );
};

export default FormattedNumber;
