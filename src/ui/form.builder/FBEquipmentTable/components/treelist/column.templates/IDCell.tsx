import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { cloneDeep, debounce } from 'lodash';
import React, { ChangeEvent, Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { EquipmentTreelistContext } from '..';
import { translate } from '../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import OverflowContent from '../../../../../components/OverflowContent';
import { FB } from '../../../../helpers';
import { EditableEquipmentItem } from '../../../types';
import { ADD_FIELD, MIN_SEARCH_TERM_LENGTH, MODE_FIELD } from '../constants';
import { isEditEquipItem } from '../utils';
import useStyles from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

interface EditorProps {
  field?: string
  value: OptionType
  setValue: Dispatch<SetStateAction<OptionType>>
  dataItem: EditableEquipmentItem
  isLoading?: boolean
  equipmentOptions: OptionType[]
  allowedEditEqOptions: OptionType[]
  isMPIForm?: boolean
  isEBProcedure?: boolean
}

const Editor: React.FC<EditorProps> = ({
  field = '',
  value,
  setValue,
  isLoading,
  dataItem,
  equipmentOptions,
  allowedEditEqOptions,
  isMPIForm,
  isEBProcedure,
}) => {
  const { setFieldValue, errors, getFieldProps, values } = useFormikContext<EditableEquipmentItem>();
  const [items, setItems] = React.useState<OptionType[] | undefined>([]);
  const { disabledOptions } = React.useContext(EquipmentTreelistContext);
  const [inputValue, setInputValue] = React.useState<string>();
  const isUpdateAction = dataItem[MODE_FIELD];
  const isFreeSolo = values?.LHRTparameter || isEBProcedure;

  useEffect(() => {
    const fieldValue = dataItem[field ?? ''];
    const value = equipmentOptions.find((option) => option.value === fieldValue);

    if (value && field) {
      setValue(value);
      setFieldValue(field, value?.value);
    } else if (fieldValue) {
      setValue({ label: fieldValue, value: fieldValue });
    }
    setItems(allowedEditEqOptions);
  }, [equipmentOptions, allowedEditEqOptions]);

  useEffect(() => {
    if (!isMPIForm) {
      return;
    }

    const fieldValue = values[field ?? ''] || inputValue;

    if (fieldValue && !FB.isUUID(fieldValue)) {
      const updatedValue = isFreeSolo ? fieldValue : '';
      setValue({ label: updatedValue, value: updatedValue });
      setFieldValue(field, updatedValue);
    }
  }, [isFreeSolo]);

  useEffect(() => {
    const title = cloneDeep(values?.title);

    if (isEBProcedure && inputValue) {
      setFieldValue(field, inputValue);
      return;
    }

    if (!isUpdateAction || FB.isUUID(title ?? '')) {
      return;
    }

    if (!isFreeSolo && !title) {
      setItems(allowedEditEqOptions ?? []);
    }
  }, [values]);

  const handleChange = (_: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    field && setFieldValue(field, option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

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
    <FormikField
      name={field}
      required
      error={Boolean(errors[field])}
    >
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        forcePopupIcon
        options={items}
        onInputChange={debounceFunction}
        disableOpenOnFocus
        blurOnSelect
        ListboxComponent={({ children, ...otherProps }) => {
          return (<>
            <ul {...otherProps} >
              {children}
            </ul>
          </>);
        }}
        getOptionDisabled={(option) =>
          (isEBProcedure && disabledOptions?.includes(option.value)) ?? false
        }
        placeholder={translate('common.select')}
        getOptionLabel={(option: OptionType) => option.label}
        freeSolo
        loading={isLoading}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

const IDCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, level, onExpandChange, expanded, getItem, equipmentOptions, allowedEditEqOptions, isMPIForm, isEBProcedure } = props;
  const isEditMode = isEBProcedure ? isEditEquipItem(dataItem) && (!dataItem.equipmentId && !dataItem.isActualIdAddition) : isEditEquipItem(dataItem) && !dataItem.actualId && !dataItem?.isActualIdAddition;
  const classes = useStyles({ isEditMode });
  const fieldValue = getItem?.(dataItem[field ?? ''] ?? '');
  const isLoading = !equipmentOptions.length;

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === dataItem[field ?? '']);

    if (value && field) {
      setValue(value);
    }
  }, [equipmentOptions]);

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const displayValue = dataItem.type ? `${dataItem.id}:${fieldValue}` : fieldValue;

  return (
    <TreeListCellWrapper {...props}>
      <OverflowContent title={displayValue}>
        {hasChildren && !isEditMode
          && <span
            className={cx(
              classes.defaultIcon,
              { [classes.expand]: hasChildren },
              { [classes.disabled]: !hasChildren },
            )}
          >
            <FontAwesomeIcon
              data-cy="minimize-row-button"
              onClick={hasChildren ? onClick : undefined}
              size="sm"
              icon={
                expanded || !hasChildren
                  ? regular('square-minus')
                  : solid('square-plus')
              }
            />
          </span>}
        <span className={cx(classes.nameCell, classes.titleInfoCell, hasChildren ? classes.boldText : classes.normalText)}>
          {isEditMode && <div className={classes.idCellEditWrapper}>
            <Editor
              {...{
                field,
                value,
                setValue,
                dataItem,
                isLoading,
                equipmentOptions,
                allowedEditEqOptions,
                isMPIForm,
                isEBProcedure,
              }}
            />
          </div>}
          {!isEditMode && displayValue}
        </span>
      </OverflowContent>
    </TreeListCellWrapper>
  );
};

export default memo(IDCell);
