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
import { EMPTY_VALUE_PLACEHOLDER } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { DraftLotTransfer, EditableLotTransfer, FBLotTransactionsProps, LotTranferEditEvent, LotTransfer } from './types';
import { getOptionLabel, useOnHandQuantity } from './utils';
import { withFBLotTransactions } from './wrap';

const FBLotTransactions: React.FC<FBLotTransactionsProps> = ({
  transfers = [],
  locations = [],
  employees = [],
  builds = [],
  records = [],
  updateLotTransfer,
  deleteLotTransfer,
  name,
  disabled,
  ...props
}) => {
  const classes = useStyles();
  const [editedLotTransfer, setEditedLotTransfer] = React.useState<DraftLotTransfer>();
  const { initialQuantity, onHandQuantityUnit, predictOnHandQuantity } = useOnHandQuantity();
  const actionsRef = React.useRef<PopperJs>(null);
  const isActive = !disabled;

  const formik = useFormik<DraftLotTransfer>({
    initialValues: {},
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (values.from && values.to && values.from === values.to) {
        errors.to = 'validator.lot.transfers.same.location';
      }

      if (values.quantity !== undefined) {
        if (values.quantity === 0) {
          errors.quantity = 'validator.lot.transfers.quantity.null';
        }

        if (initialQuantity > 0 && values.quantity > initialQuantity) {
          errors.quantity = 'validator.lot.transfers.quantity.limit';
        }
      }

      if (values.type && values.id && values.quantity !== undefined) {
        const predictedQuantity = predictOnHandQuantity({
          newTransfer: {
            quantity: values.quantity,
            type: values.type,
          },
          skipTransfer: editedLotTransfer,
        });

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
      const lotTransferToSave = omit(values, MODE_FIELD, 'name');
      updateLotTransfer(lotTransferToSave as LotTransfer);
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
    deleteLotTransfer(editedLotTransfer as LotTransfer);
    discardLotTransfer();
  };

  const handleResize = () => {
    actionsRef.current?.scheduleUpdate();
  };

  const handleRowClick = isActive && !editedLotTransfer ? editLotTransfer : undefined;

  const schema = buildSchema({
    locations,
    existingLocations,
    records,
    builds,
    units: onHandQuantityUnit,
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
      <td className={classes.actionsCell} key="actions">
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
    const employee = employees.find(employee => employee.id === transfer.by);
    const employeeName = employee?.user?.name ?? EMPTY_VALUE_PLACEHOLDER;
    const build = builds?.find(build => build.id === transfer.build?.id);
    const buildName = build ? getOptionLabel(build) : EMPTY_VALUE_PLACEHOLDER;
    const reference = records?.find(record => record.id === transfer.reference?.id);
    const referenceName = reference ? getOptionLabel(reference) : EMPTY_VALUE_PLACEHOLDER;

    return [
      ...list,
      {
        ...(isLotTransferEdited ? editedLotTransfer : transfer),
        employeeName,
        buildName,
        referenceName,
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
          disabled={Boolean(editedLotTransfer)}
          onClick={createDraftLotTransfer}
        >
          {translate('form.builder.lot.transfers.add')}
        </Button>
      )}
    </Box>
  );
};

export default withFBLotTransactions(FBLotTransactions);
