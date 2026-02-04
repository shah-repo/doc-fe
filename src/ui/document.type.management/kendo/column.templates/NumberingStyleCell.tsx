import { DropDownList } from '@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList';
import { GridCellProps } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import React from 'react';
import { styles } from '../../../components/common/kendo.column.templates/ActiveDropdown.style';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { NUMBERING_STYLE_OPTIONS } from '../../../form.builder/FBApprovalMatrix/constants';

export const NumberingStyleCell: React.FunctionComponent<GridCellProps> = ({
  dataItem,
  field,
  rowType,
  onChange,
  colSpan,
  style,
  className,
  columnIndex,
}) => {
  const dropDownData = NUMBERING_STYLE_OPTIONS;
  const isEdit = dataItem.inEdit;
  const disabled = dataItem.isNewRecord || false;
  const formattedValue = get(dataItem, field || '');
  if (rowType === 'groupHeader') {
    return null;
  }
  const classes = styles();
  const handleChange = (e) => {
    if (!onChange) {
      return;
    }
    onChange({
      dataIndex: 0,
      dataItem,
      field,
      syntheticEvent: e.syntheticEvent,
      value: e.target.value.value,
    });
  };
  field = field || '';
  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {isEdit ? (
        <DropDownList
          disabled={disabled}
          onChange={handleChange}
          value={
            dropDownData.find((c) => c.value === dataValue) || dropDownData[0]
          }
          data={dropDownData}
          textField="text"
        />
      ) : (
        <div className={classes.topButton}>
          <span className={`${classes.dot} ${classes[formattedValue]}`} />
          <Tooltip customClass={classes.value} data={formattedValue} />
        </div>
      )}
    </td>
  );
};
