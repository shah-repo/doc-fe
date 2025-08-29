import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { EditableEquipmentItem } from '../../../interface';
import { ADD_FIELD, MODE_FIELD } from '../constants';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

interface EditorProps {
  field?: string
  value: OptionType
  setValue: Dispatch<SetStateAction<OptionType>>
  dataItem: EditableEquipmentItem
  parentPartRevId?: string
  actualId?: string
  isLoading?: boolean
  equipmentOptions: OptionType[]
}

const Editor: React.FC<EditorProps> = ({
  field = '',
  value,
  setValue,
  isLoading,
  dataItem,
  equipmentOptions,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableEquipmentItem>();

  useEffect(() => {
    const value = equipmentOptions.find((option) => option.value === dataItem[field ?? '']);

    if (value && field) {
      setValue(value);
      setFieldValue(field, value?.value);
    }
  }, [equipmentOptions]);

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    field && setFieldValue(field, option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  return (
    <FormikField
      name={field}
      required
      error={Boolean(errors[field])}
    >
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disableOpenOnFocus={true}
        blurOnSelect
        ListboxComponent={({ children, ...otherProps }) => {
          return (<>
            <ul {...otherProps} >
              {children}
            </ul>
          </>);
        }}
        options={equipmentOptions}
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
  const { hasChildren, dataItem, field, level, onExpandChange, expanded, getItem, equipmentOptions } = props;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && (!dataItem.actualId && !dataItem?.isActualIdAddition);
  const classes = styles({ hasChildren, isEditMode });
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
      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && <div className={classes.idCellEditWrapper}>
          <Editor
            {...{
              field,
              value,
              setValue,
              dataItem,
              isLoading,
              equipmentOptions,
            }}
          />
        </div>}
        {!isEditMode && displayValue}
      </span>
    </TreeListCellWrapper>
  );
};

export default memo(IDCell);
