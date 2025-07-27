import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { useObserver } from 'mobx-react';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import FBAutocompleteAsyncState from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../../helpers';
import { EditableEquipmentItem } from '../../../interface';
import { ADD_FIELD } from '../constants';
import { isEditEquipItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps, EquipOption } from './types';

const IDCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, onExpandChange, expanded, getItem, ariaColumnIndex, colIndex, className }) => {
  const isEditMode = isEditEquipItem(dataItem);
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue, errors } = useFormikContext<EditableEquipmentItem>();
  const navigationAttributes = useTableKeyboardNavigation(id);
  const docId = getItem?.(dataItem.plannedId ?? '');

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  const equipAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.equipment,
  });

  useEffect(() => {
    equipAsync.load();
  }, [equipAsync]);

  const equipDocs = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.equipment) as Map<string, EquipOption>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const value = renderOptions().find((option) => option.value === dataItem.plannedId);

    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [equipDocs]);

  const renderOptions = () => {
    return equipDocs.map((part) => ({
      label: translate('wo.displayRevision', { docId: part.document.docId, displayRevision: part?.displayRevision, name: part?.name }),
      value: part.id,
    }));
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue('plannedId', option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });

  const getFieldInfo = () => (
    field && <FormikField
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
        options={renderOptions()}
        placeholder={translate('common.select')}
        getOptionLabel={(option: OptionType) => option.label}
        freeSolo
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={expanded}
      aria-selected="false"
      {...{ colSpan, id, style }}
      data-cy="cell-id"
    >
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
          { getFieldInfo()}
        </div>}
        {!isEditMode && docId}
      </span>
    </td>
  );
};

export default memo(IDCell);
