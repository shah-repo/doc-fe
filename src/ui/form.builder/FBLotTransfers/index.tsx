import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { FBSection } from '..';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Button } from '../../components/forms/fields-next';
import FBInput from '../FBInput/FBInput';
import { MODE_FIELD, Mode } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableLotTransfer, FBLotTransactionsProps, LotTranferEditEvent, LotTransferType } from './types';
import { withFBLotTransactions } from './wrap';

const FBLotTransactions: React.FC<FBLotTransactionsProps> = ({
  transfers = [],
  locations = [],
  employees = [],
  builds = [],
  addLotTransfer,
  updateLotTransfer,
  name,
  ...props
}) => {
  const classes = useStyles();
  const isActive = true;
  const [editedLotTransfer, setEditedLotTransfer] = React.useState<EditableLotTransfer>();

  const createDraftLotTransfer = () => setEditedLotTransfer({
    id: '',
    type: LotTransferType.Allocate,
    from: '',
    to: '',
    quantity: 0,
    date: new Date(),
    by: '',
    [MODE_FIELD]: Mode.add,
  });

  const editLotTransfer = ({ dataItem }: LotTranferEditEvent) => setEditedLotTransfer(dataItem);
  const discardLotTransfer = () => setEditedLotTransfer(undefined);

  const updateEditedLotTransfer = (event: DataGridItemChangeEvent<EditableLotTransfer>) => {
    if (!editedLotTransfer || !event.field) {
      return;
    }
    setEditedLotTransfer({
      ...editedLotTransfer,
      [event.field]: event.value as unknown,
    });
  };

  const saveLotTransfer = () => {
    discardLotTransfer();
  };

  const schema = buildSchema({
    locations,
    employees,
    builds,
    isActive,
    actionsClass: classes.actionsCell,
    onConfirm: saveLotTransfer,
    onDiscard: discardLotTransfer,
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

  const isLotTransferAdded = editedLotTransfer?.[MODE_FIELD] === Mode.add;

  const transferList = transfers.reduce((list, transfer) => {
    const isLotTransferEdited = editedLotTransfer && editedLotTransfer.id === transfer.id;
    return [
      ...list,
      {
        ...(isLotTransferEdited ? editedLotTransfer : transfer),
        [MODE_FIELD]: isLotTransferEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isLotTransferAdded ? [editedLotTransfer] : []);

  return (
    <Box position="relative">
      <FBSection
        label="form.builder.lot.transfers.title"
      />
      <FBInput {...props} type="lotTransfers" name={name}>
        <KendoDataGrid<EditableLotTransfer>
          fullWidth
          hasBoxScrollbars
          data={transferList}
          schema={schema}
          rowRender={rowRender}
          onRowClick={isActive ? editLotTransfer : undefined}
          onItemChange={updateEditedLotTransfer}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        />
      </FBInput>
      {isActive && (
        <Button
          kind="add"
          fullWidth
          onClick={createDraftLotTransfer}
        >
          {translate('form.builder.lot.transfers.add')}
        </Button>
      )}
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
