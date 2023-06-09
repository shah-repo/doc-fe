import { Box } from '@material-ui/core';
import cx from 'classnames';
import React, { useState } from 'react';
import { Autocomplete, Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../components/Text';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import useStyles from '../FBApprovalMatrixRoles/styles';
import { FBLotTransactionsProps, LotTransfer, LotTransferType } from './types';
import { withFBLotTransactions } from './wrap';

const FBLotTransactions: React.FC<FBLotTransactionsProps> = ({
  transactions,
  locations,
  addLotTransaction,
}) => {
  const [data, setData] = useState<LotTransferType[]>(transactions);
  const classes = useStyles();

  // todo
  const isActive = true;

  const handleItemChange = (event: DataGridItemChangeEvent<LotTransfer>) => {
    const updatedData = [...data];
    const { dataItem, field, value } = event;
    const newDataItem = { ...dataItem, [field]: value };
    updatedData[data.indexOf(dataItem)] = newDataItem;
    setData(updatedData);
  };

  const rowRender: DataGridProps<LotTransfer>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as LotTransfer;
    const isUpdating = [LotTransferType.Allocate, LotTransferType.Transfer, LotTransferType.Return].includes(item.type);

    return React.cloneElement(row, {
      className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
    });
  };

  // yet to customize and move to new file
  const schema: DataGridProps<Partial<LotTransfer>>['schema'] = [
    {
      id: 'type',
      field: 'type',
      title: 'Type',
      editor: 'text',
      width: 200,
      width: 200,
      filterCell: InputFilter,
      template: (props) => (
        <Autocomplete
          options={transactions.map((transaction) => transaction.type)}
          value={props.value}
          onChange={(event, newValue) => props.onChange({ value: newValue })}
        />
      ),
    },
    {
      id: 'from',
      field: 'from',
      title: 'From',
      editor: 'text',
      template: (props) => (
        <Autocomplete
          options={locations.map((location) => location.name)}
          value={props.value}
          onChange={(event, newValue) => props.onChange({ value: newValue })}
        />
      ),
      filterCell: InputFilter,
    },
    {
      id: 'to',
      field: 'to',
      title: 'To',
      editor: 'text',
      template: (props) => (
        <Autocomplete
          options={locations.map((location) => location.name)}
          value={props.value}
          onChange={(event, newValue) => props.onChange({ value: newValue })}
        />
      ),
      filterCell: InputFilter,
    },
    {
      id: 'build',
      field: 'build',
      title: 'Build',
      editor: 'text',
      filterCell: InputFilter,
    },
    {
      id: 'quantity',
      field: 'quantity',
      title: 'Quantity',
      editor: 'numeric',
      filterCell: InputFilter,
    },
    {
      id: 'date',
      field: 'date',
      title: 'Date',
      editor: 'date',
      filterCell: InputFilter,
    },
    {
      id: 'by',
      field: 'by',
      title: 'By',
      editor: 'text',
      filterCell: InputFilter,
    },
    {
      id: 'comment',
      field: 'comment',
      title: 'Comment',
      editor: 'text',
      width: 400,
      editable: true,
      filterCell: InputFilter,
    },
  ];

  const handleAddRow = () => {
    const newRow: LotTransfer = {
      type: '',
      from: '',
      to: '',
      build: '',
      quantity: 0,
      date: new Date(),
      by: '',
      comment: '',
    };
    setData([...data, newRow]);
  };

  return (
    <Box className={classes.root}>
      <Box my={2}>
        <KendoDataGrid<LotTransfer>
          data={data}
          rowRender={rowRender}
          onItemChange={handleItemChange}
          schema={schema}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
          filterable
        />
        <Button
          attached
          fullWidth
          kind="add"
          // data-cy="form-builder-add-another-role"
          // disabled={editedRole !== undefined}
          onClick={handleAddRow}
        >
          <Text message="form.builder.new.transaction" />
        </Button>
      </Box>
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
