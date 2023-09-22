import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { translate } from '../../../../../../common/intl';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { EditableBOM } from '../../../interface';
import { CELL_EMPTY_VALUE } from '../constants';
import { isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const CommentsCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field = 'comment',
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const { values, getFieldProps } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem);
  const displayValue = isEditMode ? values[field] ?? '' : dataItem[field];

  const getFieldInfo = () =>
    field && (
      <FormikField
        name={field}
      >
        <TextField
          {...getFieldProps(field)}
          autosize
          size="small"
          inputProps={{
            rowsMax: 5,
          }}
          value={displayValue}
          placeholder={translate('form.builder.lot.transfers.comments')}
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
      data-cy="cell.comments"
    >
      {isEditMode && getFieldInfo()}
      {!isEditMode && displayValue && (
        <OverflowTooltip
          title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
          placement="top"
          interactive
          arrow
        >
          {displayValue}
        </OverflowTooltip>
      )}
      {!isEditMode && !displayValue && CELL_EMPTY_VALUE}
    </td>
  );
};

export default CommentsCell;
