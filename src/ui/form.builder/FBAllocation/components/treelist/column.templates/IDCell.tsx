import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { EditableAllocationItem } from '../../../interface';
import { ADD_FIELD, SELECTED_PART_KEY_SEPARATOR } from '../constants';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const IDCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, openDetailDrawer, onExpandChange, expanded, ariaColumnIndex, colIndex, className }) => {
  const isEditMode = isEditAllocItem(dataItem) && !dataItem.isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableAllocationItem>();
  const navigationAttributes = useTableKeyboardNavigation(id);

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    const docInfo = option?.value.split(SELECTED_PART_KEY_SEPARATOR) ?? [];
    setValue(option as OptionType);
    if (dataItem[ADD_FIELD]) {
      setFieldValue('childNodeRevId', docInfo[0]);
      setFieldValue('childNodeDocumentId', docInfo[1]);
    } else {
      setFieldValue('newChildNodeRevId', docInfo[0]);
    }
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });

  const getFieldInfo = () => (
    field && <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disableOpenOnFocus={true}
        blurOnSelect
        ListboxComponent={({ children, ...otherProps }) => {
          return (<>
            <ul {...otherProps} >
              {/* <li className={classes.createPartOption} onClick={handleAddButtonClick}>
                <FontAwesomeIcon icon={regular('plus')} />&nbsp;
                <span >{translate('form.builder.create.new.part')}</span>
              </li> */}
              {children}
            </ul>
          </>);
        }}
        options={[]}
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
      <>
        {hasChildren
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
      </>

      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && <div className={classes.idCellEditWrapper}>
          { getFieldInfo()}
        </div>}
        {!isEditMode
        && (dataItem.itemId) }
      </span>
    </td>
  );
};

export default memo(IDCell);
