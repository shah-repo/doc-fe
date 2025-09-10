import { Box } from '@material-ui/core';
import React from 'react';
import { useDate } from '../../../../common/utils/date';
import Text from '../../../components/Text';
import { FBPurchaseOrderTableProps } from '../types';

type Props = Pick<FBPurchaseOrderTableProps, 'calculation'>;

const Exchange: React.FC<Props> = ({
  calculation,
}) => {
  const { getFormattedStartOfDayDateString } = useDate();

  return (
    <Box>
      <Box>
        <Text
          translation="form.builder.date.of.exchange"
          values={{
            fixerLink: (
              <a href="https://fixer.io" target="_blank" rel="noopener noreferrer">fixer.io</a>
            ),
            dateOfExchangeRate: getFormattedStartOfDayDateString(calculation?.dateOfExchangeRate),
          }}
        />
      </Box>
      <Box>
        <Text message={`form.builder.${calculation?.currency ?? 'USD'}.to.USD`} values={{ rate: calculation?.exchangeRate }} />
      </Box>
      <Box>
        <Text translation="form.builder.total.in.USD" values={{ total: calculation?.totalInUSD }} />
      </Box>
    </Box>
  );
};

export default Exchange;
