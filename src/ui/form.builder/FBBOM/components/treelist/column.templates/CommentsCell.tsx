import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { translate } from '../../../../../../common/intl';
import {
  FormikField,
  TextField,
} from '../../../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { ADD_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const CommentsCell: ComponentType<CustomTreeListCellProps> = ({
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
  const value = values.comments ?? '';
  const isEditMode = dataItem[MODE_FIELD] || dataItem[ADD_FIELD];
  const displayValue = dataItem[field ?? ''] ?? '-';

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
          value={value}
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
    >
      {isEditMode && getFieldInfo()}
      {!isEditMode && (
        <OverflowTooltip
          title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
          placement="top"
          interactive
          arrow
        >
          {displayValue}
        </OverflowTooltip>
      )}
    </td>
  );
};

export default CommentsCell;
