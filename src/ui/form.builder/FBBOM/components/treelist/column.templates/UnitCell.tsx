import { DropDownList } from '@progress/kendo-react-dropdowns';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { find, isString } from 'lodash';
import React, { ComponentType } from 'react';
import { translate } from '../../../../../../common/intl';
import {
  FormikField,
} from '../../../../../components/forms/fields-next';
import unitsOptions from '../../../../FBData/unitsOptions.json';
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
  const data = unitsOptions.map(item => ({ ...item, text: translate(item.text) }));
  const getValue = () => find(data, { value: isString(values[field]) ? values[field] : values[field]?.value });

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <DropDownList
          {...getFieldProps(field)}
          data={data}
          textField="text"
          dataItemKey="value"
          value={getValue()}
          disabled={!enableFieldAfterPartSelection(dataItem, values.docId)}
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
