import { Box } from '@material-ui/core';
import cx from 'classnames';
import { omit } from 'lodash';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FBSection } from '..';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridItemChangeEvent, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Button } from '../../components/forms/fields-next';
import Actions from '../FBApprovalMatrixRoles/components/Actions';
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
  updateLotTransfer,
  deleteLotTransfer,
  name,
  disabled,
  ...props
}) => {
  const classes = useStyles();
  const [editedLotTransfer, setEditedLotTransfer] = React.useState<EditableLotTransfer>();
  const isActive = !disabled;
  const isEditing = Boolean(editedLotTransfer);

  const createDraftLotTransfer = () => setEditedLotTransfer({
    id: uuidv4(),
    type: LotTransferType.Allocate,
    from: '',
    to: '',
    quantity: 0,
    date: new Date().toISOString(),
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
    if (!editedLotTransfer) {
      return;
    }
    const lotTransferToSave = omit(editedLotTransfer, [MODE_FIELD]);
    updateLotTransfer?.(lotTransferToSave);
    discardLotTransfer();
  };

  const removeLotTransfer = () => {
    if (!editedLotTransfer) {
      return;
    }
    if (editedLotTransfer[MODE_FIELD] === Mode.edit) {
      const lotTransferToRemove = omit(editedLotTransfer, [MODE_FIELD]);
      deleteLotTransfer?.(lotTransferToRemove);
    }
    discardLotTransfer();
  };

  const schema = buildSchema({
    locations,
    employees,
    builds,
  });

  const rowRender: DataGridProps<EditableLotTransfer>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLotTransfer;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);

    const actions = (
      <td className={classes.actionsCell}>
        <Actions
          dataItem={item}
          onConfirm={saveLotTransfer}
          onDiscard={discardLotTransfer}
          onDelete={removeLotTransfer}
        />
      </td>
    );

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
      },
      isUpdating ? [row.props.children, actions] : row.props.children,
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
          className={cx(classes.grid, { [classes.gridWithButton]: isActive, [classes.gridEditing]: isEditing })}
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
