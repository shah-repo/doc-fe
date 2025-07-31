import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../components/OverflowContent';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';

const ActualIdCellTemplate: React.FC<CustomTreeListCellProps> = ({
  hasChildren,
  colSpan,
  id,
  style,
  dataItem,
  field,
  level,
  parts,
  onExpandChange,
  expanded,
  ariaColumnIndex,
  colIndex,
  className,
}) => {
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue, errors } = useFormikContext<EditableMaterial>();
  const navigationAttributes = useTableKeyboardNavigation(id);

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  useEffect(() => {
    // if (!isEditMode) {
    //   return;
    // }

    const value = renderOptions()?.find((option) => option.value === dataItem.plannedId);

    console.log('value', value, dataItem);

    // if (value && field) {
    //   setFieldValue(field, value);
    //   setValue(value);
    // }
  }, [parts]);

  const renderOptions = () => {
    return parts?.map((part) => ({
      label: translate('wo.displayRevision', {
        docId: part.document.docId,
        displayRevision: part?.displayRevision,
        name: part?.name,
      }),
      value: part.id,
    }));
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue('partRevId', option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });

  const getFieldInfo = () =>
    field && (
      <FormikField name={field} required error={Boolean(errors[field])}>
        <Autocomplete
          {...getFieldProps(field)}
          value={value}
          disableOpenOnFocus={true}
          blurOnSelect
          ListboxComponent={({ children, ...otherProps }) => {
            return (
              <>
                <ul {...otherProps}>{children}</ul>
              </>
            );
          }}
          options={renderOptions()}
          placeholder={translate('common.select')}
          getOptionLabel={(option: OptionType) => option.label}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );

  const displayValue = value.label ?? dataItem?.[field ?? ''];
  console.log('Final ', displayValue);

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={expanded}
      aria-selected="false"
      onClick={handleClick}
      {...{ colSpan, id, style }}
      data-cy={`${field}-cell`}
    >
      {isEditMode && (
        <span className={cx(classes.nameCell, classes.titleInfoCell)}>
          <div className={classes.idCellEditWrapper}>{getFieldInfo()}</div>
        </span>
      )}
      {!isEditMode && <OverflowContent title={displayValue}>{displayValue}</OverflowContent>}
    </td>
  );
};

export default memo(ActualIdCellTemplate);
