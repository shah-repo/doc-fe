import cx from 'classnames';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../components/OverflowContent';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import { MIN_SEARCH_TERM_LENGTH } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

const ActualIdCellTemplate: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, materialSelectOptions, field = '' } = props;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && (dataItem?.isLotAddition || dataItem?.lotId);
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableMaterial>();
  const [items, setItems] = React.useState<OptionType[] | undefined>([]);

  useEffect(() => {
    const actualId = dataItem.actualId ?? '';
    const value = materialSelectOptions?.find((option) => option.value === actualId);

    if (value && field) {
      setValue(value);
    } else if (actualId) {
      setValue({ label: actualId, value: actualId });
    }
    setItems(materialSelectOptions);
  }, [materialSelectOptions]);

  const handleChange = (_: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue(field, option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const displayValue = value?.label ?? dataItem?.[field ?? ''];

  const onInputChange = (_: React.ChangeEvent<{}>, inputVal: string, reason: string) => {
    if (reason !== 'input') {
      return;
    }

    setFieldValue(field, inputVal);
    setValue({ label: inputVal, value: inputVal });

    if (inputVal?.length >= MIN_SEARCH_TERM_LENGTH) {
      const filteredOptions = materialSelectOptions?.filter((option) =>
        option.label.toLowerCase().includes(inputVal?.toLowerCase()),
      );
      setItems(filteredOptions);
    }
  };

  const debounceFunction = debounce(onInputChange, 1000, {
    leading: true,
    trailing: true,
  });

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && (
        <span className={cx(classes.nameCell, classes.titleInfoCell)}>
          <div className={classes.idCellEditWrapper}>
            <FormikField name={field ?? ''}>
              <Autocomplete
                {...getFieldProps(field)}
                blurOnSelect
                disableClearable
                freeSolo
                forcePopupIcon
                options={items}
                onInputChange={debounceFunction}
                value={value}
                getOptionLabel={(option: OptionType) => option.label}
                renderOption={(option) => {
                  return <div className={classes.optionWrap}>{option.label}</div>;
                }}
                onChange={handleChange}
                placeholder={translate('common.select.or.enter.placeholder')}
                size="small"
              />
            </FormikField>
          </div>
        </span>
      )}
      {!isEditMode && <OverflowContent title={displayValue}>{displayValue}</OverflowContent>}
    </TreeListCellWrapper>
  );
};

export default memo(ActualIdCellTemplate);
