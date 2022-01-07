/* eslint-disable react-hooks/exhaustive-deps */
import { DropDownList } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import Tooltip from "../../../components/common/kendo/Tooltip";

export const GroupCell = (props) => {
  const intl = useIntl();
  const isOfficial = props.dataItem[props.field];
  const localizedData = [
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] }),
      value: true,
    },
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.UNOFFICIAL] }),
      value: false,
    },
  ];
  const updateGroupField = (event: any) => {
    const Selectedvalue = event?.target?.value;
    props.dataItem.isOfficial = Selectedvalue.value;
    props.setOfficial(Selectedvalue.value);
  };
  const valueSelected = localizedData.filter(
    (e) => e.value === props.isOfficial
  )[0];

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit ? (
        <DropDownList
          onChange={updateGroupField}
          data={localizedData}
          textField="text"
          dataItemKey="value"
          value={valueSelected}
        />
      ) : (
        <Tooltip
          data ={isOfficial
            ? intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] })
            : intl.formatMessage({
              id: TranslatedText[DisplayText.UNOFFICIAL],
            })}
        />
      )}
    </td>
  );
};
