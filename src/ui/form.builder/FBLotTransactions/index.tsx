import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import { Employee } from '../../../state/ducks/company/types';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../components/Text';
import { Button } from '../../components/forms/fields-next';
import { toastError } from '../../components/notifications';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { ERROR_FIELD, ErrorField, MODE_FIELD, Mode } from '../FBApprovalMatrixRoles/constants';
import useStyles from '../FBApprovalMatrixRoles/styles';
import ActionsCellTemplate from './components/ActionsCellTemplate';
import { CommentsCellTemplate } from './components/CommentsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { EmployeeCellTemplate } from './components/EmployeeCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { QuantityCellTemplate } from './components/QuantityCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import { CompanyLocation, EditableLotTransfer, FBLotTransactionsProps, LotTranferEditEvent, LotTransferType } from './types';
import { withFBLotTransactions } from './wrap';

interface SchemaOptions {
  locations: CompanyLocation[]
  employees: Employee[]
  actionsClass: string
  discardLotTransaction: () => void
  saveLotTransaction: () => void
}

const buildSchema = ({
  locations,
  employees,
  actionsClass,
  discardLotTransaction,
  saveLotTransaction,
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
  {
    id: 'actions',
    field: 'actions',
    className: actionsClass,
    filterable: false,
    template: (props) => (
      <ActionsCellTemplate
        {...props}
        onConfirm={saveLotTransaction}
        onDiscard={discardLotTransaction}
      />
    ),
    width: 0,
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

  // TO DO, add new empty row
  const addNewLotTransaction = () => setEditedLotTransfer({
    id: '',
    type: LotTransferType.Allocate,
    from: '',
    to: '',
    build: { id: '', docId: '' },
    quantity: 0,
    date: new Date(),
    by: '',
    comments: '',
    [MODE_FIELD]: Mode.add,
  });

  const editLotTransfer = ({ dataItem }: LotTranferEditEvent) => setEditedLotTransfer(dataItem);
  const discardLotTransaction = () => setEditedLotTransfer(undefined);

  const updateEditedLotTransfer = (event: DataGridItemChangeEvent<EditableLotTransfer>) => {
    if (!editedLotTransfer || !event.field) {
      return;
    }
    setEditedLotTransfer({
      ...editedLotTransfer,
      [event.field]: event.value as unknown,
    });
  };

  const setFieldError = (field: ErrorField) => setEditedLotTransfer(prev => {
    if (!prev) {
      return prev;
    }
    return {
      ...prev,
      [ERROR_FIELD]: field,
    };
  });

  // TO DO
  const isLotTransactionValid = (lotTransfer: EditableLotTransfer) => {
    if (lotTransfer.type === null) {
      toastError(translate('form.builder.approvalRoles.error.empty'));
      setFieldError(ErrorField.name);
      return false;
    }
  };

  // TO DO yet to finsih it. n
  const saveLotTransaction = () => {
    console.log('saveLotTransaction');
    if (!editedLotTransfer || !isLotTransactionValid(editedLotTransfer)) {
      return;
    }
    // const LotTransferToSave = omit(editedLotTransfer, MODE_FIELD);
    // isNewLotTransactionAdded ? addRole(LotTransferToSave) : updateRole(LotTransferToSave);

    discardLotTransaction();
  };

  // const isNewLotTransactionAdded = editedLotTransfer?.[MODE_FIELD] === Mode.add;

  const schema = buildSchema({
    locations,
    employees,
    actionsClass: classes.actionsCell,
    discardLotTransaction,
    saveLotTransaction,
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
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        onItemChange={updateEditedLotTransfer}
      />
      {isActive && (
        <Button
          attached
          fullWidth
          kind="add"
          data-cy="form-builder-add-another-role"
          // disabled={editedRole !== undefined}
          onClick={addNewLotTransaction}
        >
          <Text message="form.builder.add.another.role" />
        </Button>
      )}
    </Box>
  );
};
export default withFBLotTransactions(FBLotTransactions);
