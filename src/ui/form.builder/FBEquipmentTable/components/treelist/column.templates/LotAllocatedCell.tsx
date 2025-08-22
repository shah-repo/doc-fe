import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../../../common/utils/date';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import DocumentRevisionDialog from '../../../../../components/common/dialogs/DocumentRevisionDialog';
import { Autocomplete, FormikField, IconButton } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import useHover from '../../../../../hooks/useHover';
import { Colors } from '../../../../../layout/theme-next';
import { EditableEquipmentItem } from '../../../interface';
import { ADD_FIELD, IS_ACTUAL_ID_ADDITION, MODE_FIELD } from '../constants';
import { isEditEquipItem } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps, LotAutoCompleteOptions } from './types';

interface LotAutocompleteProps {
  field?: string
  lots: DocumentRevision[]
  value: OptionType
  setValue: Dispatch<SetStateAction<OptionType>>
  dataItem: EditableEquipmentItem
  parentPartRevId?: string
  lotRevId?: string
  isLoading?: boolean
  equipmentOptions: OptionType[]
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
  equipmentOptions,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableEquipmentItem>();

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === dataItem[field ?? '']);

    if (value && field) {
      setValue(value);
    }
  }, [equipmentOptions]);

  const handleChange = (_, option?: OptionType) => {
    setValue(option ?? { label: '', value: '' });
    field && setFieldValue(field, option?.value);
    setFieldValue(IS_ACTUAL_ID_ADDITION, true);
    setFieldValue('parentEquipPlannedId', dataItem?.parentEquipPlannedId);
    setFieldValue('parentId', dataItem?.parentId);
    setFieldValue('id', dataItem.id);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  return (
    <FormikField name={field} required error={Boolean(errors[field])}>
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!!lotRevId}
        options={equipmentOptions}
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

const LotAllocatedCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, equipmentOptions, addActualId, onScanClick, isDisabled } = props;
  const { parentEquipPlannedId, actualId } = dataItem;
  const isEditMode = isEditEquipItem(dataItem);
  const classes = styles({ hasChildren, isEditMode });
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [addBarCodeRef, isAddBarCodeRef] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const quickViewDialog = useDialog();
  const openQuickViewDialog = () => quickViewDialog.open();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const isAddActualIdVisible
      = dataItem?.isActualIdAddition || dataItem?.actualId ? false : !(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]);
  const actualEquipDocId = dataItem?.actualEquipDocId ?? '';
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (isEmpty(parentEquipPlannedId)) {
      return;
    }

    fetchAvailablePartsAsync.start(fetchAvailablePartsAction, parentEquipPlannedId, fetchAvailablePartsAsync);
  }, [dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const value = renderOptions().find((option) => option.value === actualId);

    if (value && field) {
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

  const isLoading = fetchAvailablePartsAsync.isLoading;

  if (isAddActualIdVisible) {
    return (
      <TreeListCellWrapper {...props}>
        <span className={cx(classes.defaultIcon)}>
          <StyleTooltip title={translate('common.add')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={addLotRef} disabled={isDisabled} data-cy="add-lot-button">
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, { [classes.disabled]: isDisabled })}
                onClick={() => addActualId?.(dataItem)}
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
        <span className={classes.lotInfoId}>
          {isEditMode ? (
            <LotAutocomplete
              {...{
                field,
                lots,
                value,
                setValue,
                dataItem,
                isLoading: fetchAvailablePartsAsync.isLoading,
                equipmentOptions,
              }}
            />
          ) : (
            actualEquipDocId
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
        {...{ docRevId: actualId, parentRevId: parentEquipPlannedId }}
      />
    </TreeListCellWrapper>
  );
};

export default LotAllocatedCell;
