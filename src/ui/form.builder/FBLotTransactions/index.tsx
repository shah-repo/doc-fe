import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import { Employee } from '../../../state/ducks/company/types';
import DateFormatter from '../../components/Date';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { Mode, MODE_FIELD } from '../FBApprovalMatrixRoles/constants';
import useStyles from '../FBApprovalMatrixRoles/styles';
import { EmployeeCellTemplate } from './components/EmployeeCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { CompanyLocation, EditableLot, FBLotTransactionsProps, LotEditEvent, LotTransfer, LotTransferType } from './types';
import { withFBLotTransactions } from './wrap';

interface SchemaOptions {
  locations: CompanyLocation[]
  employees: Employee[]
  onRowClick?: (e: LotEditEvent) => void
}

const buildSchema = ({
  locations,
  employees,
  onRowClick,
}: SchemaOptions): Array<ColumnDefinition<LotTransfer>> => ([
  {
    id: 'type',
    field: 'type',
    title: 'Transfer Type',
    filterCell: InputFilter,
    template: ({ dataItem }) => translate(`form.builder.lotTransactions.type.${dataItem.type}`),
  },
  {
    id: 'from',
    field: 'from',
    title: 'From',
    filterCell: InputFilter,
    template: (props) => <LocationCellTemplate {...props} locations={locations} onClick={onRowClick} />,
  },
  {
    id: 'to',
    field: 'to',
    title: 'To',
    filterCell: InputFilter,
    template: (props) => <LocationCellTemplate {...props} locations={locations} onClick={onRowClick} />,
  },
  {
    id: 'build',
    field: 'build',
    title: 'Build',
    filterCell: InputFilter,
    template: ({ dataItem }) => dataItem.build?.docId ?? '-',
  },
  {
    id: 'quantity',
    field: 'quantity',
    title: 'Quantity',
    filterCell: InputFilter,
    template: ({ dataItem }) => {
      const NEGATIVE_TRANSFER_TYPES = [LotTransferType.Allocate, LotTransferType.Transfer];
      return NEGATIVE_TRANSFER_TYPES.includes(dataItem.type) ? `-${dataItem.quantity}` : dataItem.quantity;
    },
  },
  {
    id: 'date',
    field: 'date',
    title: 'Date',
    filterCell: InputFilter,
    template: ({ dataItem }) => <DateFormatter value={dataItem.date} format={MomentFormats.MonthDateYearTwoDigit} />,
  },
  {
    id: 'by',
    field: 'by',
    title: 'By',
    filterCell: InputFilter,
    template: (props) => <EmployeeCellTemplate {...props} employees={employees} />,
  },
  {
    id: 'comments',
    field: 'comments',
    title: 'Comments',
    filterCell: InputFilter,
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

  const [editedLot, setEditedLot] = React.useState<EditableLot>();

  const editLot = ({ dataItem }: LotEditEvent) => {
    const editedLot = { ...dataItem, [MODE_FIELD]: Mode.edit };
    setEditedLot(editedLot);
  };

  const schema = buildSchema({
    locations,
    employees,
    onRowClick: isActive ? editLot : undefined,
  });

  const rowRender: DataGridProps<EditableLot>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLot;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    // const dataCy = `row-${kebabCase(item.name)}`;

    return React.cloneElement(
      row,
      {
        // ['data-cy' as string]: dataCy,
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
      },
    );
  };

  return (
    <Box>
      <KendoDataGrid<LotTransfer>
        data={transactions}
        schema={schema}
        rowRender={rowRender}
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        onRowClick={isActive ? editLot : undefined}
        filterable
      />
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
