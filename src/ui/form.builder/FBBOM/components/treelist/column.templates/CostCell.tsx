import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import {
  FormikField,
  TextField,
} from '../../../../../components/forms/fields-next';
import { ADD_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
import { getCellValue, isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const CostCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const { getFieldProps } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem);

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          type="text"
          inputProps={{ min: 0 }}
          disabled={dataItem[ADD_FIELD]}
          size="small"
        />
      </FormikField>
    );
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
    >
      {isEditMode && getFieldInfo()}
      {!isEditMode && (
        <span className={classes.Cell}>
          {getCellValue(dataItem, field)}
        </span>
      )}
    </td>
  );
};

export default CostCell;
