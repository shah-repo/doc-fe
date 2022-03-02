import { TextField } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";

export const EmailCell  = (props: GridCellProps) => {
  const {
    dataItem,
    rowType,
    colSpan,
    columnIndex,
    style,
    className,
  } = props;
  const updateEmailField = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dataItem.email = target.value;
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
          onChange={updateEmailField}
        />
      ) : (
        <Tooltip
          data={
            dataItem.user ? dataItem.user.email : dataItem.items[0]?.user.email
          }
        />
      )}
    </td>
  );
};
