import { DropDownList } from "@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList";
import { GridCellProps } from "@progress/kendo-react-grid";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../kendo/helpers";
import Tooltip from "../kendo/Tooltip";
import { styles } from "./ActiveDropdown.style";

export const ActiveDropdown: React.FunctionComponent<GridCellProps> = ({
  dataItem,
  field,
  rowType,
  onChange,
  colSpan,
  style,
  className,
  columnIndex,
}) => {
  const intl = useIntl();
  const dropDownData = [
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.ACTIVE] }),
      value: true,
    },
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.INACTIVE] }),
      value: false,
    },
  ];
  const isEdit = dataItem.inEdit;
  const disabled = dataItem.isNewRecord || false;
  const formattedValue = get(dataItem, field || "");
  if (rowType === "groupHeader") {
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
  field = field || "";
  const dataValue = dataItem[field] === null ? "" : dataItem[field];
  const dropDownValue = intl.formatMessage({
    id: TranslatedText[dataValue ? DisplayText.ACTIVE
      : DisplayText.INACTIVE],
  });
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
          {dropDownValue}
          <span className={`${classes.dot} ${classes[formattedValue]}`}></span>
          <Tooltip customClass={classes.value} data={formattedValue} />
        </div>
      )}
    </td>
  );
};
