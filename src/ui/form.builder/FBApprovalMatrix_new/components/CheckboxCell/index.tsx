import React from "react";
import { get, set } from "lodash";
import Cell from "../Cell";
import {
  Checkbox, CheckboxChangeEvent,
} from "@progress/kendo-react-inputs";
import { EDIT_FIELD } from "../Grid";
import { GridCellProps } from "@progress/kendo-react-grid";

const CheckboxCell: React.FC<GridCellProps> = (props) => {
  const { dataItem, field, dataIndex, onChange } = props;

  const path = field || "";
  const value = Boolean(get(dataItem, path));

  const handleChange = (e: CheckboxChangeEvent) => {
    onChange?.({
      dataIndex,
      dataItem: set(dataItem, path, e.value),
      syntheticEvent: e.syntheticEvent,
      field,
      value: e.target.value,
    });
  };

  return (
    <Cell {...props}>
      <Checkbox
        value={value}
        disabled={!dataItem[EDIT_FIELD]}
        onChange={handleChange}
      />
    </Cell>
  );
};

export default CheckboxCell;
