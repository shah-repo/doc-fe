import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import PopperJs from 'popper.js';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FBSection } from '..';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Button } from '../../components/forms/fields-next';
import FBInput from '../FBInput/FBInput';
import { ActionsCell } from './components/ActionsCell';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableLotTransfer, FBLotTransactionsProps, LotTranferEditEvent, LotTransfer } from './types';
import { useOnHandQuantity } from './utils';
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
  const [editedLotTransfer, setEditedLotTransfer] = React.useState<Partial<EditableLotTransfer>>();
  const { initialQuantity, predictOnHandQuantity } = useOnHandQuantity();
  const actionsRef = React.useRef<PopperJs>(null);
  const isActive = !disabled && initialQuantity !== null && initialQuantity > 0;

  const formik = useFormik<Partial<EditableLotTransfer>>({
    initialValues: {},
    validate: (values) => {
      const errors: Record<string, string> = {};
      const isInitialQuantityValid = initialQuantity !== null;

      if (values.from && values.to && values.from === values.to) {
        errors.to = 'validator.lot.transfers.same.location';
      }

      if (isInitialQuantityValid && values.quantity) {
        if (values.quantity === 0) {
          errors.quantity = 'validator.lot.transfers.quantity.null';
        }

        if (values.quantity > initialQuantity) {
          errors.quantity = 'validator.lot.transfers.quantity.limit';
        }
      }

      const predictedQuantity
        = values.type && values.quantity
          ? predictOnHandQuantity({
            newTransfer: values,
            skipTransfer: editedLotTransfer as LotTransfer,
          })
          : null;

      if (isInitialQuantityValid && predictedQuantity !== null) {
        if (predictedQuantity < 0) {
          errors.quantity = 'validator.lot.transfers.quantity.min';
        }
        if (predictedQuantity > initialQuantity) {
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

  const { resetForm, setValues, dirty } = formik;

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
    resetForm({ values: editedLotTransfer ?? {} });
  }, [editedLotTransfer, setValues, resetForm]);

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

  const handleResize = () => {
    actionsRef.current?.scheduleUpdate();
  };

  const handleRowClick = isActive ? editLotTransfer : undefined;

  const schema = buildSchema({
    locations,
    existingLocations,
    employees,
    builds,
    onRowClick: handleRowClick,
  });

  const rowRender: DataGridProps<EditableLotTransfer>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLotTransfer;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const predictedQuantity = predictOnHandQuantity({ skipTransfer: item });

    const isQuantityPredicted = predictedQuantity !== null && initialQuantity !== null;
    const isPredictedQuantityValid = isQuantityPredicted && predictedQuantity >= 0 && predictedQuantity <= initialQuantity;
    const shouldDisableDelete = isQuantityPredicted && item[MODE_FIELD] === Mode.edit && !isPredictedQuantityValid;
    const deleteTootltipSuffix = isQuantityPredicted && predictedQuantity < 0 ? 'min' : 'max';

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
          popperRef={actionsRef}
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
      <PromptIfDirty
        dirty={dirty}
      />
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
          onRowClick={handleRowClick}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
          onResize={handleResize}
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
