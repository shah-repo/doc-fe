import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import {
  FormikField,
  TextField,
} from '../../../../../components/forms/fields-next';
import { EditableBOM } from '../../../interface';
import { enableFieldAfterPartSelection, getCellValue, isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const UnitCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const { values, getFieldProps } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem);

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          type="text"
          inputProps={{ min: 0 }}
          disabled={!enableFieldAfterPartSelection(dataItem, values.docId)}
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

export default UnitCell;
