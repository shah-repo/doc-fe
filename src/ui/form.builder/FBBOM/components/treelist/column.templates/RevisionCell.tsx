import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ComponentType } from 'react';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { ADD_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
import { getCellValue, isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const RevisionCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren, isEditMode: dataItem[ADD_FIELD] });
  const { values, getFieldProps } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem);
  const isAvailableRevsExists = isEditMode && !isEmpty(dataItem?.availableRevisions);

  const renderOptions = () => {
    return [dataItem?.revision, dataItem?.availableRevisions?.revision];
  };

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          options={renderOptions()}
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
      {isAvailableRevsExists && getFieldInfo()}
      {!isAvailableRevsExists && (
        <span className={classes.Cell}>
          {getCellValue(isEditMode ? values : dataItem, field)}
        </span>
      )}
    </td>
  );
};

export default RevisionCell;
