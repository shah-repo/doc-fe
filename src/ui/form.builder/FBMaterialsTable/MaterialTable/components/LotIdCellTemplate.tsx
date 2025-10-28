import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, ListItem, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { MomentFormats, useDate } from '../../../../../common/utils/date';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import DocumentRevisionDialog from '../../../../components/common/dialogs/DocumentRevisionDialog';
import { Autocomplete, FormikField, IconButton } from '../../../../components/forms/fields-next';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import useHover from '../../../../hooks/useHover';
import { ADD_FIELD, IS_LOT_ADDITION, MODE_FIELD } from '../constants';
import { CustomTreeListCellProps, EditableMaterial, LotOptions } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

interface LotAutocompleteProps {
  field?: string
  lots: DocumentRevision[]
  value: LotOptions
  setValue: Dispatch<SetStateAction<LotOptions>>
  dataItem: EditableMaterial
  parentPartPlannedId?: string
  lotRevId?: string
  isLoading?: boolean
}

const LotAutocomplete: React.FC<LotAutocompleteProps> = ({
  field = '',
  lots,
  value,
  setValue,
  isLoading,
  dataItem,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableMaterial>();
  const { getFormattedDateString } = useDate();
  const options = useMemo(
    () =>
      lots.map((lot) => ({
        label: lot.document.docId,
        value: lot.id,
        expiryDate: lot.isExpired ? getFormattedDateString(lot.expiryDate, MomentFormats.MonthDateYearTwoDigit) : '',
        isExpired: lot.isExpired,
      })),
    [lots],
  );

  const handleChange = (_, option?: LotOptions) => {
    setValue(option ?? { label: '', value: '', documentId: '' });
    const selectedLot = lots.find((lot) => lot.id === option?.value);
    field && setFieldValue(field, option?.value);
    setFieldValue('quantityOnHand', selectedLot?.precalc?.lot_on_hand_quantity);
    setFieldValue(IS_LOT_ADDITION, true);
    setFieldValue('parentPartPlannedId', dataItem.parentPartPlannedId);
    setFieldValue('selectedLotLabel', option?.label);
    setFieldValue('parentId', dataItem.parentId);
    setFieldValue('id', dataItem.id);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  return (
    <FormikField name={field} required error={Boolean(errors[field])}>
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!!dataItem[field]}
        options={options}
        blurOnSelect
        disableOpenOnFocus
        placeholder={translate('common.select')}
        size="small"
        getOptionLabel={(opt) => opt.label}
        renderOption={(option, props) => (
          <ListItem {...props} className="lot-list-item" disableGutters>
            <ListItemText primary={option.label} />
          </ListItem>
        )}
        loading={isLoading}
        onChange={handleChange}
      />
    </FormikField>
  );
};

const LotIdCellTemplate: React.FC<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, addLot, isDisabled, onScanClick } = props;
  const { parentPartPlannedId, lotId } = dataItem;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && (dataItem?.isLotAddition || dataItem?.lotId);
  const classes = styles({ hasChildren, isEditMode });
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [addBarCodeRef, isAddBarCodeRef] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const quickViewDialog = useDialog();
  const openQuickViewDialog = () => quickViewDialog.open();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const [value, setValue] = useState<LotOptions>({ label: '', value: '', documentId: '' });

  const isAddLotVisible = !dataItem?.isLotAddition && !dataItem?.lotId
    && dataItem?.isLotAdditionIconsShown === true
    && !(dataItem?.[MODE_FIELD] || dataItem?.[ADD_FIELD]);

  const lotDocId = dataItem?.lotDocId ?? value.label ?? '';
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (isEmpty(parentPartPlannedId)) {
      return;
    }

    fetchAvailablePartsAsync.start(fetchAvailablePartsAction, parentPartPlannedId, fetchAvailablePartsAsync, false);
  }, [parentPartPlannedId, dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    const value = renderOptions().find((option) => option.value === lotId);

    if (value && field) {
      setValue(value);
    }
  }, [lots]);

  const renderOptions = useCallback(() => {
    return lots.map((lot) => {
      const { id, document, documentId } = lot;
      return {
        label: document.docId,
        value: id,
        documentId: documentId,
      };
    });
  }, [lots]);

  const isLoading = fetchAvailablePartsAsync.isLoading;

  if (isAddLotVisible) {
    if (isDisabled) {
      return <TreeListCellWrapper {...props}><></> </TreeListCellWrapper>;
    }

    return (
      <TreeListCellWrapper {...props}>
        <span className={cx(classes.defaultIcon)}>
          <StyleTooltip title={translate('common.add')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={addLotRef} disabled={isDisabled} data-cy="add-lot-button">
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, { [classes.disabled]: isDisabled })}
                onClick={() => addLot?.(dataItem)}
                icon={isAddLotHovered ? solid('circle-plus') : regular('circle-plus')}
              />
            </IconButton>
          </StyleTooltip>
        </span>
        <span className={cx(classes.defaultIcon)}>
          <StyleTooltip title={translate('common.scan')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={addBarCodeRef} data-cy="scan-lot">
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, classes.scanIcon, { [classes.disabled]: isDisabled })}
                onClick={() => onScanClick?.(dataItem)}
                icon={isAddBarCodeRef ? solid('barcode-read') : regular('barcode-read')}
              />
            </IconButton>
          </StyleTooltip>
        </span>
      </TreeListCellWrapper>
    );
  }

  if (isLoading && !isEditMode) {
    return (
      <TreeListCellWrapper {...props}>
        <CircularProgress size={16} className={classes.progress} />
      </TreeListCellWrapper>
    );
  }

  return (
    <TreeListCellWrapper {...props}>
      <span className={cx(classes.lotNameCell, classes.titleInfoCell)}>
        <span className={cx({ [classes.lotInfoId]: !isEditMode })}>
          {isEditMode ? (
            <LotAutocomplete
              {...{
                field,
                lots,
                value,
                setValue,
                dataItem,
                parentPartPlannedId,
                isLoading: fetchAvailablePartsAsync.isLoading,
              }}
            />
          ) : (
            lotDocId
          )}
        </span>
        {!isEditMode && value.label && (
          <StyleTooltip title={translate('relatedParts.created.modal.quick.view')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={viewLotRef} data-cy="view-lot-button">
              <FontAwesomeIcon
                size="sm"
                className={classes.viewIcon}
                icon={isViewLotHovered ? solid('eye') : light('eye')}
                onClick={openQuickViewDialog}
              />
            </IconButton>
          </StyleTooltip>
        )}
      </span>
      <DocumentRevisionDialog
        dialog={quickViewDialog}
        {...{ docRevId: lotId, parentRevId: parentPartPlannedId }}
      />
    </TreeListCellWrapper>
  );
};

export default LotIdCellTemplate;
