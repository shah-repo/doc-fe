import { Box, Popper } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FBSection } from '..';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Button } from '../../components/forms/fields-next';
import Actions, { ActionsProps } from '../FBApprovalMatrixRoles/components/Actions';
import FBInput from '../FBInput/FBInput';
import { MODE_FIELD, Mode } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableLotTransfer, FBLotTransactionsProps, LotTranferEditEvent, LotTransfer } from './types';
import { withFBLotTransactions } from './wrap';

const ActionsCell: React.FC<ActionsProps<EditableLotTransfer>> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} style={{ height: '100%' }} />
      <Popper
        open
        placement="bottom-end"
        anchorEl={ref.current}
      >
        <Actions
          scrollBehavior="smooth"
          {...props}
        />
      </Popper>
    </>
  );
};

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
  const [editedLotTransfer, setEditedLotTransfer] = React.useState<Partial<EditableLotTransfer>>();
  const isActive = !disabled;

  const formik = useFormik<Partial<EditableLotTransfer>>({
    initialValues: {},
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (values.from && values.to && values.from === values.to) {
        errors.to = 'validator.lot.transfers.same.location';
      }
      return errors;
    },
    onSubmit: (values) => {
      const lotTransferToSave = omit(values, [MODE_FIELD]);
      updateLotTransfer?.(lotTransferToSave as LotTransfer);
      discardLotTransfer();
    },
  });

  const { setValues } = formik;

  useEffect(() => {
    setValues(editedLotTransfer ?? {});
  }, [editedLotTransfer, setValues]);

  const createDraftLotTransfer = () => setEditedLotTransfer({
    id: uuidv4(),
    date: new Date().toISOString(),
    [MODE_FIELD]: Mode.add,
  });

  const editLotTransfer = ({ dataItem }: LotTranferEditEvent) => setEditedLotTransfer(dataItem);
  const discardLotTransfer = () => {
    setEditedLotTransfer(undefined);
    formik.resetForm();
  };

  const removeLotTransfer = () => {
    if (!editedLotTransfer) {
      return;
    }
    deleteLotTransfer?.(editedLotTransfer as LotTransfer);
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
        <ActionsCell
          dataItem={item}
          onConfirm={formik.submitForm}
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
      <FBInput {...props} type="lotTransfers" name={name}>
        <FBSection
          label="form.builder.lot.transfers.title"
        />
      </FBInput>
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableLotTransfer>
          fullWidth
          hasBoxScrollbars
          data={transferList as EditableLotTransfer[]}
          schema={schema}
          rowRender={rowRender}
          onRowClick={isActive ? editLotTransfer : undefined}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        />
      </FormikProvider>
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
