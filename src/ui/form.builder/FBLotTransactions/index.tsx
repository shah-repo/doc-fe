import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { Employee } from '../../../state/ducks/company/types';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { Mode, MODE_FIELD } from '../FBApprovalMatrixRoles/constants';
import useStyles from '../FBApprovalMatrixRoles/styles';
import { CommentsCellTemplate } from './components/CommentsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { EmployeeCellTemplate } from './components/EmployeeCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { QuantityCellTemplate } from './components/QuantityCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import { CompanyLocation, EditableLotTransfer, FBLotTransactionsProps, LotTranferEditEvent } from './types';
import { withFBLotTransactions } from './wrap';

interface SchemaOptions {
  locations: CompanyLocation[]
  employees: Employee[]
}

const buildSchema = ({
  locations,
  employees,
}: SchemaOptions): Array<ColumnDefinition<EditableLotTransfer>> => ([
  {
    id: 'type',
    field: 'type',
    title: 'Transfer Type',
    filterCell: InputFilter,
    template: TransferTypeCellTemplate,
    width: 150,
  },
  {
    id: 'from',
    field: 'from',
    title: 'From',
    filterCell: InputFilter,
    template: (props) => <LocationCellTemplate {...props} locations={locations} />,
    width: 200,
  },
  {
    id: 'to',
    field: 'to',
    title: 'To',
    filterCell: InputFilter,
    template: (props) => <LocationCellTemplate {...props} locations={locations} />,
    width: 200,
  },
  {
    id: 'build',
    field: 'build',
    title: 'Build',
    filterCell: InputFilter,
    template: ({ dataItem }) => dataItem.build?.docId ?? '-',
    width: 200,
  },
  {
    id: 'quantity',
    field: 'quantity',
    title: 'Quantity',
    filterCell: InputFilter,
    template: QuantityCellTemplate,
    width: 150,
  },
  {
    id: 'date',
    field: 'date',
    title: 'Date',
    filterCell: InputFilter,
    template: DateCellTemplate,
    width: 150,
  },
  {
    id: 'by',
    field: 'by',
    title: 'By',
    filterCell: InputFilter,
    template: (props) => <EmployeeCellTemplate {...props} employees={employees} />,
    width: 150,
  },
  {
    id: 'comments',
    field: 'comments',
    title: 'Comments',
    filterCell: InputFilter,
    template: CommentsCellTemplate,
    width: 200,
  },
]);

const FBLotTransactions: React.FC<FBLotTransactionsProps> = ({
  transactions = [],
  locations = [],
  employees = [],
  addLotTransaction,
}) => {
  const classes = useStyles();
  const isActive = true;
  const [editedLotTransfer, setEditedLotTransfer] = React.useState<EditableLotTransfer>();

  const editLotTransfer = ({ dataItem }: LotTranferEditEvent) => setEditedLotTransfer(dataItem);

  const updateEditedLotTransfer = (event: DataGridItemChangeEvent<EditableLotTransfer>) => {
    if (!editedLotTransfer || !event.field) {
      return;
    }
    setEditedLotTransfer({
      ...editedLotTransfer,
      [event.field]: event.value as unknown,
    });
  };

  const schema = buildSchema({
    locations,
    employees,
  });

  const rowRender: DataGridProps<EditableLotTransfer>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLotTransfer;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
      },
    );
  };

  const transactionsList = transactions.map((transfer) => {
    const isLotTransferEdited = editedLotTransfer && editedLotTransfer.id === transfer.id;

    return {
      ...(isLotTransferEdited ? editedLotTransfer : transfer),
      [MODE_FIELD]: isLotTransferEdited ? Mode.edit : Mode.show,
    };
  });

  return (
    <Box position="relative">
      <KendoDataGrid<EditableLotTransfer>
        fullWidth
        filterable
        hasBoxScrollbars
        data={transactionsList}
        schema={schema}
        rowRender={rowRender}
        onRowClick={isActive ? editLotTransfer : undefined}
        onItemChange={updateEditedLotTransfer}
      />
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
