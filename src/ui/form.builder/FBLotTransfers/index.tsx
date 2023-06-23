import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { useOnHandQuantity } from './utils';
import { withFBLotTransactions } from './wrap';

const ActionsCell: React.FC<ActionsProps<EditableLotTransfer> & { rootClassName?: string }> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} className={props.rootClassName} />
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
  const { initialQuantity, predictOnHandQuantity } = useOnHandQuantity();
  const isActive = !disabled && initialQuantity;

  const formik = useFormik<Partial<EditableLotTransfer>>({
    initialValues: {},
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (values.from && values.to && values.from === values.to) {
        errors.to = 'validator.lot.transfers.same.location';
      }
      if (values.quantity && values.type) {
        const predictedQuantity = predictOnHandQuantity({
          newTransfer: values as LotTransfer,
          skipTransfer: editedLotTransfer as LotTransfer,
        });
        if (predictedQuantity < 0) {
          errors.quantity = 'validator.lot.transfers.quantity.min';
        }
        if (predictedQuantity > initialQuantity) {
          errors.quantity = 'validator.lot.transfers.quantity.max';
        }
        if (values.quantity > initialQuantity) {
          errors.quantity = 'validator.lot.transfers.quantity.max';
        }
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

  const existingLocations = transfers.reduce<string[]>((list, transfer) => {
    if (!list.includes(transfer.from)) {
      list.push(transfer.from);
    }
    if (transfer.to && !list.includes(transfer.to)) {
      list.push(transfer.to);
    }
    return list;
  }, []);

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
    existingLocations,
    employees,
    builds,
  });

  const rowRender: DataGridProps<EditableLotTransfer>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLotTransfer;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const predictedQuantity = predictOnHandQuantity({
      skipTransfer: item,
    });

    const shouldDisableDelete = (predictedQuantity < 0 || predictedQuantity > initialQuantity);
    const deleteTootltipSuffix = predictedQuantity < 0 ? 'min' : 'max';

    const deleteTootltipText
      = shouldDisableDelete
        ? translate(`validator.lot.transfers.quantity.${deleteTootltipSuffix}`)
        : undefined;

    const actions = (
      <td className={classes.actionsCell}>
        <ActionsCell
          dataItem={item}
          onConfirm={formik.submitForm}
          onDiscard={discardLotTransfer}
          onDelete={removeLotTransfer}
          deleteTooltipText={deleteTootltipText}
          isDeleteDisabled={shouldDisableDelete}
          rootClassName={classes.popperHolder}
        />
      </td>
    );

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
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
        >
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftLotTransfer}
            >
              {translate('form.builder.lot.transfers.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableLotTransfer>
          filterable
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
