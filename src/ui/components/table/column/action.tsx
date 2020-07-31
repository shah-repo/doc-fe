import { Fab } from "@material-ui/core";
import { Add, Edit, FileCopy, OpenInNew } from "@material-ui/icons";
import React from "react";
import { TableSelectionProps } from "../types";
import { TableColumnActionProps } from "./types";

type Props<T> = TableColumnActionProps<T>;

const TableColumnAction = <T extends any>(): React.FunctionComponent<
Props<T>
> => ({ actionType, rowData, onSelect }) => {
  const iconRenderer = () => {
    switch (actionType) {
      case "EDIT":
        return <Edit />;
      case "FILE_COPY":
        return <FileCopy />;
      case "PREVIEW":
        return <OpenInNew />;
      case "ADD":
        return <Add />;
      default:
        return null;
    }
  };

  // eslint-disable-next-line: no-shadowed-variable
  const handleClick = ({ rowData, actionType }: TableSelectionProps<T>) => (
    e: React.MouseEvent,
  ) => {
    if (onSelect) {
      onSelect({ rowData, actionType })();
      e.stopPropagation();
    }
  };

  return (
    <Fab
      color={actionType === "ADD" ? "secondary" : undefined}
      size="small"
      onClick={handleClick({ rowData, actionType })}
    >
      {iconRenderer()}
    </Fab>
  );
};

export default TableColumnAction;
