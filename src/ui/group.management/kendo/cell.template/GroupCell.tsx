/* eslint-disable react-hooks/exhaustive-deps */
import { DropDownList, DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import Tooltip from "../../../components/common/kendo/Tooltip";

interface GroupCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: any;
  className?: string;
  columnIndex?: number;
  setOfficial: ((props: boolean) => void);
  isOfficial: boolean;
  field?: string;
}

export const GroupCell = ({
  dataItem,
  setOfficial,
  isOfficial,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  field,
}: GroupCellProps) => {
  const intl = useIntl();
  const groupData = dataItem[field || ""];
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
  const updateGroupField = ({ target }: DropDownListChangeEvent) => {
    const Selectedvalue = target?.value;
    dataItem.isOfficial = Selectedvalue.value;
    setOfficial(Selectedvalue.value);
  };
  const valueSelected = localizedData.filter(
    (e) => e.value === isOfficial
  )[0];

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit ? (
        <DropDownList
          onChange={updateGroupField}
          data={localizedData}
          textField="text"
          dataItemKey="value"
          value={valueSelected}
        />
      ) : (
        <Tooltip
          data ={groupData
            ? intl.formatMessage({ id: TranslatedText[DisplayText.OFFICIAL] })
            : intl.formatMessage({
              id: TranslatedText[DisplayText.UNOFFICIAL],
            })}
        />
      )}
    </td>
  );
};
