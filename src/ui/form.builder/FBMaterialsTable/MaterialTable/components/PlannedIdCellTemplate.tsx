import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab/useAutocomplete';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { cloneDeep, isEmpty } from 'lodash';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { MaterialTreelistContext } from '..';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../components/OverflowContent';
import { Colors } from '../../../../layout/theme-next';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import { FB } from '../../../helpers';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';
import { isPartHasInsufficientQty } from './utils';

const PlannedIdCellTemplate: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, onExpandChange, level, hasChildren, materialSelectOptions, expanded, isLHRT } = props;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && !dataItem.lotId && !dataItem?.isLotAddition;
  const isUpdateAction = dataItem[MODE_FIELD];
  const classes = styles({ isEditMode });
  const { getFieldProps, setFieldValue, values, errors } = useFormikContext<EditableMaterial>();
  const isFreeSolo = !isLHRT && values?.LHRTparameter;
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const [modifiedOptions, setModifiedOptions] = useState<OptionType[]>(materialSelectOptions ?? []);
  const { lhrsQuantity = 1 } = React.useContext(MaterialTreelistContext);
  const { isInsufficientQty, totalAssignedQty, quantityNeeded } = (!isEditMode && hasChildren) ? isPartHasInsufficientQty(dataItem, lhrsQuantity) : { isInsufficientQty: false, totalAssignedQty: 0, quantityNeeded: 0 };

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  useEffect(() => {
    if (!materialSelectOptions?.length) {
      return;
    }

    setModifiedOptions(materialSelectOptions);
    const value = materialSelectOptions?.find((option) => option.value === dataItem[field]);
    if (value && field) {
      setValue(value);
    } else {
      setInputValue(values?.title ?? '');
    }
  }, [materialSelectOptions]);

  useEffect(() => {
    const title = cloneDeep(values?.title);

    if (!isUpdateAction || FB.isUUID(title ?? '')) {
      return;
    }

    if (isLHRT) {
      setFieldValue(field, inputValue);
      setInputValue('');
      return;
    }

    if (!values.LHRTparameter && inputValue && !title) {
      setInputValue('');
      return;
    }

    if (values.LHRTparameter && inputValue) {
      setFieldValue(field, inputValue);
    }
  }, [values]);

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string, reason: string) => {
    if (reason !== 'input') {
      return;
    }

    if (!inputVal && inputValue) {
      setFieldValue(field, '');
    }

    if (inputValue === inputVal && !isEmpty(inputVal)) {
      return;
    }

    if (inputValue && inputValue.length > 2 && modifiedOptions?.length) {
      const stringify = (option: OptionType) => option.label || '';
      const filterOptions = createFilterOptions({ ignoreAccents: false, stringify });
      const updatedOptions = filterOptions(modifiedOptions, { inputValue });
      setModifiedOptions(updatedOptions);
    } else if (!inputValue) {
      setModifiedOptions(materialSelectOptions ?? []);
    }

    setInputValue(inputVal);

    if (!isFreeSolo) {
      return;
    }

    setFieldValue(field, inputVal);
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue(field, option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
    setInputValue('');
  };

  const fieldValue = value?.label || dataItem?.[field ?? ''];
  const displayValue = dataItem.LHRTparameter ? `${dataItem.id}:${fieldValue}` : fieldValue;
  const partNumber = fieldValue.split(' ')[0] ?? '';

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && (
        <span className={cx(classes.nameCell, classes.titleInfoCell)}>
          <div className={classes.idCellEditWrapper}>
            <FormikField name={field ?? ''} required error={Boolean(errors[field ?? ''])}>
              <Autocomplete
                {...getFieldProps(field)}
                value={inputValue ? { label: inputValue } : value}
                blurOnSelect
                forcePopupIcon
                disableOpenOnFocus={true}
                freeSolo
                ListboxComponent={({ children, ...otherProps }) => {
                  return (
                    <>
                      <ul {...otherProps}>{children}</ul>
                    </>
                  );
                }}
                options={modifiedOptions}
                placeholder={translate('common.select')}
                getOptionLabel={(option: OptionType) => option.label}
                onChange={handleChange}
                onInputChange={onInputChange}
                size="small"
              />
            </FormikField>
          </div>
        </span>
      )}
      {!isEditMode && (
        <div className={classes.materialCellWrap}>
          <OverflowContent title={displayValue}>
            {hasChildren && !isEditMode && (
              <span
                className={cx(
                  classes.defaultIcon,
                  classes.expandCell,
                  {
                    [classes.expand]: hasChildren,
                    [classes.disabled]: !hasChildren,
                    [classes.boldText]: hasChildren,
                    [classes.normalText]: !hasChildren,
                  },
                )}
              >
                <FontAwesomeIcon
                  data-cy="minimize-row-button"
                  onClick={hasChildren ? onClick : undefined}
                  size="sm"
                  icon={expanded || !hasChildren ? regular('square-minus') : solid('square-plus')}
                />
              </span>
            )}
            {displayValue}
          </OverflowContent>
          {hasChildren && isInsufficientQty && (
            <span className={cx(classes.defaultIcon, classes.quantityShortInfoIcon)}>
              <Tooltip
                arrow
                title={translate('form.builder.procedure.material.table.part.quantity.short.info.msg',
                  {
                    assignedLot: totalAssignedQty ?? '',
                    lotQuantityNeeded: quantityNeeded ?? '',
                    partNumber: partNumber,
                  })}
                placement="top-start"
              >
                <FontAwesomeIcon
                  data-cy="new-revision-available"
                  color={Colors.error}
                  icon={solid('circle-exclamation')}
                />
              </Tooltip>
            </span>
          )}
        </div>
      )}

    </TreeListCellWrapper>
  );
};

export default memo(PlannedIdCellTemplate);
