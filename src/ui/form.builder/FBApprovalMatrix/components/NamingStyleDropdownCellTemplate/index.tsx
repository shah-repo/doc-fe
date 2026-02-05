import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, Tooltip } from '@material-ui/core';
import { DropDownList, DropDownListProps, DropDownsPopupSettings } from '@progress/kendo-react-dropdowns';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { Colors } from '../../../../layout/theme-next';
import { useDamRestrictions } from '../DamNumberingStyle/DamRestrictionsContext';
import { DATA_ITEM_KEY, Mode, MODE_FIELD, TEXT_FIELD } from '../Grid';

interface ExtendedCellTemplateProps<T> extends CellTemplateProps<T> {
  data: any[]
  defaultItem?: any
  emptyLabel?: string
  popupSettings?: DropDownsPopupSettings
}

const Styles = makeStyles((theme) => ({
  dropDownContainer: {
    width: '100%',
    minWidth: 0,
  },
  infoIcon: {
    color: Colors.primaryLight,
    fontSize: 14,
    opacity: 0.9,
  },
  dropdownParentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'visible',
    width: '100%',
  },
  infoIconContainer: {
    display: 'flex',
    marginLeft: theme.spacing(1),
    pointerEvents: 'auto',
  },
}));

const NamingStyleDropdownCellTemplate: React.FC<ExtendedCellTemplateProps<any>> = (props) => {
  const { data, dataItem, defaultItem, emptyLabel = '-', field, dataIndex, column, onChange, popupSettings } = props;
  const { editable } = column;
  const classes = Styles();
  const mode = dataItem[MODE_FIELD];
  const path = field ?? '';
  const value = get(dataItem, path);
  const docTypeId = dataItem.docType.id;
  const { restrictions } = useDamRestrictions();
  const {
    disabledDocTypeIds = [],
    customDocTypeIds = [],
  } = restrictions ?? {};

  const isDisabledDocType = disabledDocTypeIds.includes(docTypeId);
  const isCustomDocType = customDocTypeIds.includes(docTypeId);
  const disabled = isDisabledDocType || isCustomDocType;

  const valueItem = data.find((item) => item[DATA_ITEM_KEY] === value);

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: DropDownListProps['onChange'] = (event) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event.syntheticEvent,
      field,
      value: event.target.value[DATA_ITEM_KEY],
    });
  };

  if (!canBeModified) {
    const label = valueItem?.[TEXT_FIELD] ?? emptyLabel;

    return (
      <OverflowTooltip
        arrow
        placement="top"
        title={label}
      >
        {label}
      </OverflowTooltip>);
  }
  const tooltipMessage = isCustomDocType
    ? 'dam.number.style.dropdown.customer.selected.info.message'
    : canBeModified && !isDisabledDocType
      ? 'dam.number.style.dropdown.draft.info.message'
      : null;

  return (
    <div className={classes.dropdownParentContainer}>
      <DropDownList
        className={classes.dropDownContainer}
        data={data}
        textField={TEXT_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        defaultItem={defaultItem}
        onChange={handleChange}
        defaultValue={valueItem ?? defaultItem}
        popupSettings={popupSettings}
        disabled={disabled}
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

export default NamingStyleDropdownCellTemplate;
