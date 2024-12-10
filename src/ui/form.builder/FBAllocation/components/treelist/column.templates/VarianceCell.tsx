import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';
import { EditableAllocationItem } from '../../../interface';
import { CELL_EMPTY_VALUE } from '../constants';
import { getCellValue, isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const VarianceCell: React.ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableAllocationItem>();
  const isEditMode = isEditAllocItem(dataItem);

  const onVarianceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={onVarianceChange}
          inputProps={{ min: 0 }}
          size="small"
        />
      </FormikField>
    );

  const renderVarianceValue = () => {
    if (dataItem.isLotAddition || dataItem.lotRevId) {
      return <span className={classes.Cell}>{CELL_EMPTY_VALUE}</span>;
    }

    return isEditMode ? (
      getFieldInfo()
    ) : (
      <span className={classes.Cell}>{getCellValue(dataItem, field)}</span>
    );
  };

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
      {renderVarianceValue()}
    </td>
  );
};

export default VarianceCell;
