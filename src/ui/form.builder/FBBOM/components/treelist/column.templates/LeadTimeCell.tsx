import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import {
  FormikField,
  TextField,
} from '../../../../../components/forms/fields-next';
import { ADD_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
import { isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const LeadTimeCell: ComponentType<CustomTreeListCellProps> = ({
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
          disabled={dataItem[ADD_FIELD]}
          inputProps={{ min: 0 }}
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
        <span className={classes.titleInfoCell}>
          {dataItem[field ?? ''] ?? '-'}
        </span>
      )}
    </td>
  );
};

export default LeadTimeCell;
