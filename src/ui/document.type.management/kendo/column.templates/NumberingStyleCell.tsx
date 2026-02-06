import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { DropDownList } from '@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList';
import { GridCellProps } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import { DOCUMENT_NUMBERING_STYLE } from '../../../../state/ducks/documentRevisions/documentType/types';
import useStyles from '../../../components/common/kendo.column.templates/ActiveDropdown.style';
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
  const classes = useStyles();

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

  const isCustomerSelected = dataValue === DOCUMENT_NUMBERING_STYLE.CUSTOMER;

  const tooltipMessage = isCustomerSelected
    ? 'dam.number.style.dropdown.customer.selected.info.message'
    : isDisabledDocType
      ? null : 'dtm.number.style.dropdown.draft.info.message';

  return (
    <div className={classes.dropdownParentContainer}>
      <DropDownList
        disabled={disabled}
        onChange={handleChange}
        value={dropDownData.find((c) => c.value === dataValue) || dropDownData[0]}
        data={dropDownData}
        textField="text"
      />
      {tooltipMessage && (
        <Tooltip title={translate(tooltipMessage)} placement="top" arrow>
          <span className={classes.infoIconContainer}>
            <FontAwesomeIcon icon={solid('circle-exclamation')} className={classes.infoIcon} />
          </span>
        </Tooltip>
      )}
    </div>
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
  const classes = useStyles();
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
