import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import {
  FormikField,
  TextField,
} from '../../../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { ADD_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const RefDesignatorCell: ComponentType<CustomTreeListCellProps> = ({
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
  const isEditMode = dataItem[MODE_FIELD] || dataItem[ADD_FIELD];

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

export default RefDesignatorCell;
