import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { EditableBOM } from '../../../interface';
import { enableFieldAfterPartSelection, getCellValue, isEditBOM } from '../utils';
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
  const { values, getFieldProps } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem) && dataItem.enabledFieldsForEditing?.includes(field ?? '');
  const refDesignatorValue = getCellValue(dataItem, field);
  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          type="text"
          disabled={!enableFieldAfterPartSelection(dataItem, values.docId)}
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
      data-cy="cell-ref-designator"
    >
      {isEditMode && getFieldInfo()}
      {!isEditMode && <OverflowTooltip
        title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{refDesignatorValue}</div>}
        placement="top"
        interactive
        arrow
      >
        {refDesignatorValue}
      </OverflowTooltip>}
    </td>
  );
};

export default RefDesignatorCell;
