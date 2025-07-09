import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../../../common/utils/date';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import DocumentRevisionDialog from '../../../../../components/common/dialogs/DocumentRevisionDialog';
import ScanCaptureDialog from '../../../../../components/common/dialogs/scaner';
import { Autocomplete, FormikField, IconButton } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import { documentVersionPath } from '../../../../../document.revision/utils/paths';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import useHover from '../../../../../hooks/useHover';
import { Colors } from '../../../../../layout/theme-next';
import { EditableAllocationItem } from '../../../interface';
import { ADD_FIELD, MODE_FIELD } from '../constants';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps, LotAutoCompleteOptions } from './types';

interface LotAutocompleteProps {
  field?: string
  lots: DocumentRevision[]
  value: OptionType
  setValue: Dispatch<SetStateAction<OptionType>>
  dataItem: EditableAllocationItem
  parentPartRevId?: string
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
  lotRevId,
  parentPartRevId,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableAllocationItem>();
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

  const handleChange = (_, option?: OptionType) => {
    setValue(option ?? { label: '', value: '' });
    const selectedLot = lots.find((lot) => lot.id === option?.value);
    field && setFieldValue(field, option?.value);
    setFieldValue('lotRevId', option?.value);
    setFieldValue('quantityOnHand', selectedLot?.precalc?.lot_on_hand_quantity);
    setFieldValue('parentPartRevId', parentPartRevId);
    setFieldValue('isExpired', selectedLot?.isExpired);
    setFieldValue('expiryDate', selectedLot?.expiryDate);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  return (
    <FormikField name={field} required error={Boolean(errors[field])}>
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!!lotRevId}
        options={options}
        blurOnSelect
        disableOpenOnFocus
        placeholder={translate('common.select')}
        size="small"
        getOptionLabel={(opt) => opt.label}
        renderOption={(option: LotAutoCompleteOptions, props) => (
          <ListItem {...props} className="lot-list-item" disableGutters>
            <ListItemText primary={option.label} />
            {option.isExpired && (
              <ListItemIcon>
                <StyleTooltip
                  title={translate('allocation.lot.expired.tooltip.message', { expiryDate: option.expiryDate })}
                >
                  <FontAwesomeIcon icon={regular('circle-exclamation')} color={Colors.error} size="sm" />
                </StyleTooltip>
              </ListItemIcon>
            )}
          </ListItem>
        )}
        loading={isLoading}
        onChange={handleChange}
      />
    </FormikField>
  );
};

const LotAllocatedCell: React.FC<CustomTreeListCellProps> = ({
  hasChildren,
  colSpan,
  id,
  style,
  dataItem,
  field,
  parentRevId,
  addLot,
  ariaColumnIndex,
  colIndex,
  className,
  deleteLot,
}) => {
  const { isLotAddition, lotRevId, isDisabled, parentPartRevId, lotDocumentId, lotDocId } = dataItem ?? {};
  const isEditMode = isEditAllocItem(dataItem) && !isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const navigationAttributes = useTableKeyboardNavigation(id);
  const [removeLotRef, isRemoveLotHovered] = useHover<HTMLButtonElement>();
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [addBarCodeRef, isAddBarCodeRef] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const scanDialog = useDialog();
  const quickViewDialog = useDialog();
  const openQuickViewDialog = () => quickViewDialog.open();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const { setFieldValue } = useFormikContext<EditableAllocationItem>();
  const isAddLotVisible = hasChildren || (!isEditMode && !isLotAddition && !lotRevId);
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (isEditMode && isEmpty(parentPartRevId) && !isLotAddition) {
      return;
    }

    fetchAvailablePartsAsync.start(fetchAvailablePartsAction, parentPartRevId, fetchAvailablePartsAsync);
  }, [dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const value = renderOptions().find((option) => option.value === lotRevId);

    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [lots]);

  const renderOptions = (): LotAutoCompleteOptions[] => {
    return lots.map((lot) => {
      const { isExpired, id, expiryDate, document } = lot;
      const formattedExpiryDate = isExpired
        ? getFormattedDateString(expiryDate, MomentFormats.MonthDateYearTwoDigit)
        : '';
      return {
        label: document.docId,
        value: id,
        expiryDate: formattedExpiryDate,
        isExpired: isExpired,
      };
    });
  };

  const openScanDialog = (dataItem) => {
    scanDialog.open();
  };

  const onClose = () => {
    scanDialog.close();
  };

  console.log('dataItem', dataItem);

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-selected="false"
      {...{ colSpan, id, style }}
      data-cy="cell-lot-allocated"
    >
      {isAddLotVisible ? (
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
          {/* disabled={isDisabled} */}
          <StyleTooltip title={translate('common.scan')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={addBarCodeRef} data-cy="scan-lot">
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, classes.scanIcon, { [classes.disabled]: isDisabled })}
                onClick={() => openScanDialog?.(dataItem)}
                icon={isAddBarCodeRef ? solid('barcode-read') : regular('barcode-read')}
              />
            </IconButton>
          </StyleTooltip>
        </span>
      ) : (
        (isLotAddition || lotRevId) && (
          <span className={cx(classes.lotNameCell, classes.titleInfoCell)}>
            <div className={cx(classes.lotInfoWrapper, {
              [classes.flexJustifyBetween]: !isEditMode,
            })}>
              <span className={classes.lotInfoId}>
                {isEditMode ? (
                  <LotAutocomplete {...{ field, lots, value, setValue, dataItem, parentPartRevId, lotRevId, isLoading: fetchAvailablePartsAsync.isLoading }} />
                ) : lotRevId && lotDocumentId ? (
                  <Link to={documentVersionPath(lotRevId, lotDocumentId)} className={classes.link} target="_blank">
                    {lotDocId}
                  </Link>
                ) : (
                  lotDocId
                )}
              </span>
              {!isEditMode && (
                <span className={classes.iconGroup}>
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

                  <StyleTooltip title={translate('common.delete')} placement="top" arrow>
                    <IconButton
                      kind="simple"
                      size="small"
                      ref={removeLotRef}
                      disabled={isDisabled}
                      data-cy="remove-lot-button"
                    >
                      <FontAwesomeIcon
                        size="sm"
                        className={cx(classes.deleteIcon, {
                          [classes.disabled]: isDisabled,
                        })}
                        icon={isRemoveLotHovered ? solid('trash-can') : regular('trash-can')}
                        onClick={() => deleteLot?.(dataItem)}
                      />
                    </IconButton>
                  </StyleTooltip>
                </span>
              )}
            </div>
          </span>
        )
      )}
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: lotRevId, parentRevId }} />
      {scanDialog.isOpen && (
        <ScanCaptureDialog
          handler={scanDialog}
          onClose={onClose}
          partDocumentId={get(dataItem, 'partDocumentId', '') ?? ''}
          partId={dataItem?.partRevId ?? ''}
        />
      )}
    </td>
  );
};

export default LotAllocatedCell;
