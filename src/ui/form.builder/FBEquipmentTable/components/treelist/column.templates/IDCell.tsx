import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { EditableEquipmentItem } from '../../../interface';
import { ADD_FIELD } from '../constants';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const IDCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, onExpandChange, expanded, ariaColumnIndex, colIndex, className }) => {
  const isEditMode = isEditAllocItem(dataItem);
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue, errors } = useFormikContext<EditableEquipmentItem>();
  const navigationAttributes = useTableKeyboardNavigation(id);
  const plannedDocId = dataItem?.plannedId;

  const [parts, setParts] = React.useState<DocumentRevision[]>([]);
  console.log(setParts);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const value = renderOptions().find((option) => option.value === dataItem.plannedId);

    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [parts]);

  const renderOptions = () => {
    return parts.map((part) => ({
      label: translate('wo.displayRevision', { docId: part.document.docId, displayRevision: part?.displayRevision, name: part?.name }),
      value: part.id,
    }));
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue('partRevId', option?.value);
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
      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && <div className={classes.idCellEditWrapper}>
          { getFieldInfo()}
        </div>}
        {!isEditMode && plannedDocId }
      </span>
    </td>
  );
};

export default memo(IDCell);
