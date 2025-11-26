import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import DocumentRevisionDialog from '../../../../../components/common/dialogs/DocumentRevisionDialog';
import { Autocomplete, FormikField, IconButton } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import useDialog from '../../../../../hooks/useDialog';
import useHover from '../../../../../hooks/useHover';
import { Colors } from '../../../../../layout/theme-next';
import { EditableEquipmentItem } from '../../../types';
import { ADD_FIELD, IS_ACTUAL_ID_ADDITION, MODE_FIELD } from '../constants';
import { isEditEquipItem } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps, EquipAutoCompleteOptions } from './types';

interface LotAutocompleteProps {
  field?: string
  value: OptionType
  setValue: Dispatch<SetStateAction<OptionType>>
  dataItem: EditableEquipmentItem
  parentPartRevId?: string
  actualId?: string
  isLoading?: boolean
  equipmentOptions: OptionType[]
}

const LotAutocomplete: React.FC<LotAutocompleteProps> = ({
  field = '',
  value,
  setValue,
  isLoading,
  dataItem,
  actualId,
  parentPartRevId,
  equipmentOptions,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableEquipmentItem>();

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
        disabled={!!actualId}
        options={equipmentOptions}
        blurOnSelect
        disableOpenOnFocus
        placeholder={translate('common.select')}
        size="small"
        getOptionLabel={(opt) => opt.label}
        renderOption={(option: EquipAutoCompleteOptions, props) => (
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

const ActualIdCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, equipmentOptions, addActualId, isDisabled, isEnableActualIdAddition, isEBProcedure } = props;
  const { parentEquipPlannedId, actualId } = dataItem;
  const isEditMode = isEBProcedure ? isEditEquipItem(dataItem) && (dataItem.isActualIdAddition || dataItem.equipmentId) : isEditEquipItem(dataItem);
  const classes = styles({ isEditMode });
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const quickViewDialog = useDialog();
  const openQuickViewDialog = () => quickViewDialog.open();
  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const isAddActualIdVisible
      = dataItem?.isActualIdAddition || dataItem?.actualId || !isEnableActualIdAddition ? false : !(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]);
  const actualEquipDocId = dataItem?.actualEquipDocId ?? '';
  const isLoading = !equipmentOptions.length;

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === dataItem[field ?? '']);

    if (value && field) {
      setValue(value);
    }
  }, [equipmentOptions]);

  if (isAddActualIdVisible) {
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
                onClick={() => addActualId?.(dataItem)}
                icon={isAddLotHovered ? solid('circle-plus') : regular('circle-plus')}
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
      <span className={cx(classes.lotNameCell, classes.titleInfoCell, hasChildren ? classes.boldText : classes.normalText)}>
        <span className={cx({ [classes.lotInfoId]: !isEditMode })}>
          {isEditMode ? (
            <LotAutocomplete
              {...{
                field,
                value,
                setValue,
                dataItem,
                actualId,
                isLoading,
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

export default ActualIdCell;
