import { Box } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import DateFormatter from '../../components/Date';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { CompanyLocation, FBLotTransactionsProps, LotTransfer, LotTransferType } from './types';
import { withFBLotTransactions } from './wrap';

interface SchemaOptions {
  locations: CompanyLocation[]
}

const buildSchema = ({
  locations,
}: SchemaOptions): Array<ColumnDefinition<LotTransfer>> => ([
  {
    id: 'type',
    field: 'type',
    title: 'Transfer Type',
    template: ({ dataItem }) => translate(`form.builder.lotTransactions.type.${dataItem.type}`),
  },
  {
    id: 'from',
    field: 'from',
    title: 'From',
    template: (props) => <LocationCellTemplate {...props} locations={locations} />,
  },
  {
    id: 'to',
    field: 'to',
    title: 'To',
    template: (props) => <LocationCellTemplate {...props} locations={locations} />,
  },
  {
    id: 'build',
    field: 'build',
    title: 'Build',
    template: ({ dataItem }) => dataItem.build?.docId ?? '-',
  },
  {
    id: 'quantity',
    field: 'quantity',
    title: 'Quantity',
    template: ({ dataItem }) => {
      const NEGATIVE_TRANSFER_TYPES = [LotTransferType.Allocate, LotTransferType.Transfer];
      return NEGATIVE_TRANSFER_TYPES.includes(dataItem.type) ? `-${dataItem.quantity}` : dataItem.quantity;
    },
  },
  {
    id: 'date',
    field: 'date',
    title: 'Date',
    template: ({ dataItem }) => <DateFormatter value={dataItem.date} format={MomentFormats.MonthDateYearTwoDigit} />,
  },
  {
    id: 'by',
    field: 'by',
    title: 'By',
  },
  {
    id: 'comments',
    field: 'comments',
    title: 'Comments',
  },
]);

const FBLotTransactions: React.FC<FBLotTransactionsProps> = ({
  transactions = [],
  locations = [],
  employees = [],
  addLotTransaction,
}) => {
  const schema = buildSchema({ locations });

  return (
    <Box>
      <KendoDataGrid<LotTransfer>
        data={transactions}
        schema={schema}
      />
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
