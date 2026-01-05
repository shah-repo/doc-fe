import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, ListItem, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import moment, { MomentInput } from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { EquipmentTreelistContext } from '..';
import { translate } from '../../../../../../common/intl';
import { MomentFormats, useDate } from '../../../../../../common/utils/date';
import { ACTIVE_EQUIPMENT_STATUSES, EquipmentStatus } from '../../../../../../state/ducks/documentRevisions/types';
import DocumentRevisionDialog from '../../../../../components/common/dialogs/DocumentRevisionDialog';
import { Autocomplete, FormikField, IconButton } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import useDialog from '../../../../../hooks/useDialog';
import useHover from '../../../../../hooks/useHover';
import { EditableEquipmentItem } from '../../../types';
import { ADD_FIELD, IS_ACTUAL_ID_ADDITION, MODE_FIELD } from '../constants';
import { useEquipmentOptions } from '../hooks/useFetchData';
import { isEditEquipItem } from '../utils';
import useStyles from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { customEQOptionType, CustomTreeListCellProps } from './types';

interface LotAutocompleteProps {
  field?: string
  value: OptionType
  setValue: Dispatch<SetStateAction<OptionType>>
  dataItem: EditableEquipmentItem
  parentPartRevId?: string
  actualId?: string
  isLoading?: boolean
  equipmentOptions: OptionType[]
  isEBProcedure?: boolean
}

const LotAutocomplete: React.FC<LotAutocompleteProps> = ({
  field = '',
  value,
  setValue,
  isLoading,
  dataItem,
  actualId,
  parentPartRevId,
  isEBProcedure,
  equipmentOptions: propEquipmentOptions,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableEquipmentItem>();
  const classes = useStyles();
  const { getFormattedDateString } = useDate();
  const { isLHRProductionBuild, isEqProdConfigEnforced } = React.useContext(EquipmentTreelistContext);
  const isEquipmentSpecification = Boolean(dataItem?.isEquipmentSpecification);
  const equipmentSpecId = dataItem?.parentEquipPlannedId || parentPartRevId || '';
  const { equipmentSpcOptions } = useEquipmentOptions(equipmentSpecId);
  const filteredEquipmentOptions = propEquipmentOptions.filter((option) => {
    return option.value === equipmentSpecId;
  });
  const equipmentOptions = isEquipmentSpecification ? equipmentSpcOptions : filteredEquipmentOptions;
  const isEqActive = (eqStatus: EquipmentStatus) => ACTIVE_EQUIPMENT_STATUSES.includes(eqStatus);
  const isDateOverdue = (date: MomentInput): boolean => {
    if (!date) {
      return false;
    }
    const currentDate = getFormattedDateString(Date.now());
    return moment(currentDate).isAfter(date);
  };

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
        getOptionDisabled={(option: customEQOptionType) => {
          const { pmDueDate, calDueDate, status } = option ?? {};
          const isOverdue = isDateOverdue(pmDueDate) || isDateOverdue(calDueDate);
          const isActive = isEqActive(status as EquipmentStatus);

          if (isEBProcedure) {
            return false;
          }

          if (isEqProdConfigEnforced) {
            if (isLHRProductionBuild && isOverdue) {
              return true;
            } else return !isActive;
          }

          return false;
        }}
        renderOption={(option: customEQOptionType, props) => (
          <ListItem {...props} disableGutters className={classes.listItemOption}>
            <ListItemText
              className={classes.listItemOption}
              primary={option.label}
              secondary={
                <div className={classes.dateInfo}>
                  {option.calDueDate && (
                    <span>
                      {translate('form.builder.lhrs.procedure.select.equipment.option.cal.due', {
                        date: getFormattedDateString(option.calDueDate, MomentFormats.BriefDate),
                      })}
                    </span>
                  )}
                  {option.calDueDate && option.pmDueDate && '  |  '}
                  {option.pmDueDate && (
                    <span>
                      {translate('form.builder.lhrs.procedure.select.equipment.option.pm.due', {
                        date: getFormattedDateString(option.pmDueDate, MomentFormats.BriefDate),
                      })}
                    </span>
                  )}
                </div>
              }
            />
          </ListItem>
        )}
        loading={isLoading}
        onChange={handleChange}
      />
    </FormikField>
  );
};

const ActualIdCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, isDisabled, equipmentOptions, addActualId, isEBProcedure } = props;
  const { parentEquipPlannedId, actualId } = dataItem;
  const { isRedlineActive, isEnableActualIdAddition } = React.useContext(EquipmentTreelistContext);
  const isEditMode = isEBProcedure ? isEditEquipItem(dataItem) && (dataItem.isActualIdAddition || dataItem.equipmentId) : isEditEquipItem(dataItem);
  const classes = useStyles({ isEditMode });
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
          {isEditMode && !isRedlineActive ? (
            <LotAutocomplete
              {...{
                field,
                value,
                setValue,
                dataItem,
                actualId,
                isLoading,
                equipmentOptions,
                isEBProcedure,
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
