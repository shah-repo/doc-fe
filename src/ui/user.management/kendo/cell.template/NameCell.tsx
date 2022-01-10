import { TextField } from "@material-ui/core";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { GridCellProperties } from "../../../components/common/kendo/types";

export const NameCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProperties) => {
  const updateNameField = ({ target }: React.ChangeEvent<any>) => {
    dataItem.name = target?.value;
  };
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
        <TextField
          id="input-with-icon-textfield"
          variant="outlined"
          margin="dense"
          onChange={updateNameField}
        />
      ) : (
        <Tooltip
          data={
            dataItem.user ? dataItem.user.name : dataItem.items[0]?.user?.name
          }
        />
      )}
    </td>
  );
};
