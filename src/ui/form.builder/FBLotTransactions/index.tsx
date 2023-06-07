import { Box } from '@material-ui/core';
import React from 'react';
import { FBLotTransactionsProps } from './types';
import { withFBLotTransactions } from './wrap';

const FBLotTransactions: React.FC<FBLotTransactionsProps> = ({
  transactions,
  locations,
  addLotTransaction,

}) => {
  return (
    <Box my={2}>
      <pre>
        <code>{JSON.stringify({ transactions, locations }, null, 2)}</code>
      </pre>
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
