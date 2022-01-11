
import { GridCellProps } from "@progress/kendo-react-grid";
import {
  Checkbox,
  CheckboxChangeEvent,
} from "@progress/kendo-react-inputs";
import { result, set } from "lodash";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import "./KendoStyles.css";

export const CheckboxCell: React.FunctionComponent<GridCellProps> = ({
  dataItem,
  field,
  onChange,
  dataIndex,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}) => {
  const intl = useIntl();
  const editMode = dataItem[intl.formatMessage({ id: TranslatedText[DisplayText.INEDIT] })];
  const path = field || "";
  const [dataValue, setValue] = React.useState<boolean | null | undefined>(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setValue(result(dataItem, path));
  });

  const handleChange = (e: CheckboxChangeEvent) => {
    if (onChange) {
      setValue(e.value);
      // for parent component
      onChange({
        dataIndex,
        dataItem: set(dataItem, path, e.value), // checkbox does not update so setting it
        syntheticEvent: e.syntheticEvent,
        field,
        value: e.target.value,
      });
    }
  };

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td colSpan={colSpan}
      style= {style}
      role="gridcell"
      className={`checkbox-cell ${className}`}
      data-grid-col-index={columnIndex}
    >
      <Checkbox
        value={dataValue}
        onChange={handleChange}
        disabled={editMode ? false : true}/>
    </td>
  );
};
