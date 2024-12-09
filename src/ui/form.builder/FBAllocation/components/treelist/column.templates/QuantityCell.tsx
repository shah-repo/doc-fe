import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';
import { toFixed } from '../../../../../dashboard.new/line.items/common/Utils';
import { EditableAllocationItem } from '../../../interface';
import { MAX_DECIMALS } from '../constants';
import { getCellValue, isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const QuantityCell: React.ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableAllocationItem>();
  const isEditMode = isEditAllocItem(dataItem);

  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (!isNaN(Number(val)) && Number(val) >= 0 && field) {
      setFieldValue(field, val);
    }
  };

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          type="number"
          onChange={onQuantityChange}
          inputProps={{ min: 0 }}
          size="small"
        />
      </FormikField>
    );
  const isLotAddition = isEditMode ? values.isLotAddition : dataItem.isLotAddition;
  const isEnbleEditor = isLotAddition ? isEditMode : isEditMode && dataItem.isNewAddition;
  const showFieldValue = isLotAddition ? !isEditMode : (!isEditMode || !dataItem.isNewAddition);

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx('k-table-td', className, classes.cellborderBottom)}
      {...{
        'aria-colindex': otherProps.ariaColumnIndex,
        'data-grid-col-index': otherProps.colIndex,
        'aria-expanded': otherProps.expanded,
      }}
      data-cy={`${field}-cell-quantity`}
    >
      {isEnbleEditor && getFieldInfo()}
      {showFieldValue && (
        <span className={classes.Cell}>
          {toFixed(getCellValue(dataItem, field), MAX_DECIMALS)}
        </span>
      )}
    </td>
  );
};

export default QuantityCell;
