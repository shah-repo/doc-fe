import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { cloneDeep, debounce } from 'lodash';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import DocumentRevisionDialog from '../../../../../components/common/dialogs/DocumentRevisionDialog';
import { Autocomplete, FormikField, IconButton } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import useDialog from '../../../../../hooks/useDialog';
import useHover from '../../../../../hooks/useHover';
import { Colors } from '../../../../../layout/theme-next';
import { FB } from '../../../../helpers';
import { EditableEquipmentItem } from '../../../types';
import { ADD_FIELD, IS_ACTUAL_ID_ADDITION, MIN_SEARCH_TERM_LENGTH, MODE_FIELD } from '../constants';
import { isEditEquipItem } from '../utils';
import useStyles from './styles';
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
  isEBProcedure?: boolean
  equipmentOptions: OptionType[]
  allowedEditEqOptions: OptionType[]
}

const LotAutocomplete: React.FC<LotAutocompleteProps> = ({
  field = '',
  value,
  setValue,
  isLoading,
  dataItem,
  actualId,
  isEBProcedure,
  parentPartRevId,
  equipmentOptions,
  allowedEditEqOptions,
}) => {
  const { setFieldValue, errors, getFieldProps, values } = useFormikContext<EditableEquipmentItem>();
  const classes = useStyles();
  const [items, setItems] = React.useState<OptionType[] | undefined>([]);
  const [inputValue, setInputValue] = React.useState<string>();
  const isUpdateAction = dataItem[MODE_FIELD];
  const isFreeSolo = isEBProcedure;

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === dataItem[field ?? '']);

    if (value && field) {
      setValue(value);
    }
    setItems(allowedEditEqOptions);
  }, [equipmentOptions, allowedEditEqOptions]);

  const handleChange = (_, option?: OptionType) => {
    setValue(option ?? { label: '', value: '' });
    setInputValue(undefined);
    field && setFieldValue(field, option?.value);
    setFieldValue(IS_ACTUAL_ID_ADDITION, true);
    setFieldValue('parentEquipPlannedId', dataItem?.parentEquipPlannedId);
    setFieldValue('parentId', dataItem?.parentId);
    setFieldValue('id', dataItem.id);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  useEffect(() => {
    const equipmentId = cloneDeep(values?.[field]) ?? dataItem[field ?? ''];

    if (isEBProcedure && inputValue) {
      setFieldValue(field, inputValue);
      setFieldValue(IS_ACTUAL_ID_ADDITION, true);
      setFieldValue('parentEquipPlannedId', dataItem?.parentEquipPlannedId);
      setFieldValue('parentId', dataItem?.parentId);
      setFieldValue('id', dataItem.id);
      setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
      return;
    }

    if (isUpdateAction && !values?.[field] && equipmentId) {
      setFieldValue(field, equipmentId);
    }

    if (!isUpdateAction || FB.isUUID(equipmentId ?? '')) {
      return;
    }

    if (!isFreeSolo && !equipmentId) {
      setItems(allowedEditEqOptions ?? []);
    }
  }, [values]);

  const onInputChange = (_: React.ChangeEvent<{}>, inputVal: string, reason: string) => {
    if (reason !== 'input') {
      return;
    }

    if (!isFreeSolo) {
      setInputValue(inputVal);
      setFieldValue(field, '');
      return;
    }

    setFieldValue(field, inputVal);
    setInputValue(inputVal);
    setValue({ label: inputVal, value: inputVal });

    if (inputVal?.length >= MIN_SEARCH_TERM_LENGTH) {
      const filteredOptions = allowedEditEqOptions?.filter((option) =>
        option.label.toLowerCase().includes(inputVal?.toLowerCase()),
      );
      setItems(filteredOptions);
    } else if (!inputVal || inputVal?.length < MIN_SEARCH_TERM_LENGTH) {
      setItems(allowedEditEqOptions ?? []);
    }
  };

  const debounceFunction = debounce(onInputChange, 1000, {
    leading: true,
    trailing: true,
  });

  return (
    <FormikField name={field} required error={Boolean(errors[field])}>
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!!actualId}
        options={items}
        blurOnSelect
        freeSolo={isFreeSolo}
        onInputChange={debounceFunction}
        disableOpenOnFocus
        placeholder={translate('common.select')}
        size="small"
        getOptionLabel={(opt) => opt.label}
        renderOption={(option: EquipAutoCompleteOptions, props) => (
          <ListItem {...props} className={classes.optionListItem} disableGutters>
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

const EquipmentIdCell: React.FC<CustomTreeListCellProps> = (props) => {
  const {
    hasChildren,
    dataItem,
    field,
    equipmentOptions,
    allowedEditEqOptions,
    addActualId,
    isDisabled,
    isEnableActualIdAddition,
    isEBProcedure,
  } = props;
  const { parentEquipPlannedId, actualId } = dataItem;
  const isEditMode = isEBProcedure
    ? isEditEquipItem(dataItem) && (dataItem.isActualIdAddition || dataItem.equipmentId)
    : isEditEquipItem(dataItem);
  const classes = useStyles({ hasChildren, isEditMode });
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const quickViewDialog = useDialog();
  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const isAddActualIdVisible
    = dataItem?.isActualIdAddition || !isEnableActualIdAddition || dataItem.equipmentId
      ? false
      : !(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]);
  const isLoading = !equipmentOptions.length;

  useEffect(() => {
    const defaultValue = dataItem[field ?? ''];
    const value = equipmentOptions.find((option) => option.value === defaultValue) ?? { label: defaultValue, value: defaultValue };

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
                isEBProcedure,
                equipmentOptions,
                allowedEditEqOptions,
              }}
            />
          ) : (
            value.label
          )}
        </span>
      </span>
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: actualId, parentRevId: parentEquipPlannedId }} />
    </TreeListCellWrapper>
  );
};

export default EquipmentIdCell;
