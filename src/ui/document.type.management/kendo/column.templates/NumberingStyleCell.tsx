import { DropDownList } from '@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList';
import { GridCellProps } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import React from 'react';
import { styles } from '../../../components/common/kendo.column.templates/ActiveDropdown.style';
import { useDamRestrictions } from '../../../form.builder/FBApprovalMatrix/components/DamNumberingStyle/DamRestrictionsContext';
import { NUMBERING_STYLE_OPTIONS } from '../../../form.builder/FBApprovalMatrix/constants';

interface dataItemType extends DocumentType {
  id: string
}
interface NumberingStyleEditCellProps {
  dataItem: dataItemType
  field?: string
  onChange?: GridCellProps['onChange']
}

const NumberingStyleEditCell: React.FC<NumberingStyleEditCellProps> = ({ dataItem, field = '', onChange }) => {
  const { restrictions } = useDamRestrictions();

  const { disabledDocTypeIds = [] } = restrictions ?? {};

  const docTypeId = dataItem?.id;
  const isDisabledDocType = disabledDocTypeIds.includes(docTypeId);
  const disabled = isDisabledDocType;

  const dataValue = dataItem[field] ?? '';
  const dropDownData = NUMBERING_STYLE_OPTIONS;

  const handleChange = (e) => {
    if (!onChange) return;

    onChange({
      dataIndex: 0,
      dataItem,
      field,
      syntheticEvent: e.syntheticEvent,
      value: e.target.value.value,
    });
  };

  return (
    <DropDownList
      disabled={disabled}
      onChange={handleChange}
      value={dropDownData.find((c) => c.value === dataValue) || dropDownData[0]}
      data={dropDownData}
      textField="text"
    />
  );
};

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
  const isEdit = dataItem.inEdit;
  const formattedValue = get(dataItem, field || '');
  if (rowType === 'groupHeader') {
    return null;
  }
  const classes = styles();
  field = field || '';

  return (
    <td colSpan={colSpan} style={style} role="gridcell" className={className} data-grid-col-index={columnIndex}>
      {isEdit ? (
        <NumberingStyleEditCell dataItem={dataItem} field={field} onChange={onChange} />
      ) : (
        <div className={classes.topButton}>{formattedValue}</div>
      )}
    </td>
  );
};
