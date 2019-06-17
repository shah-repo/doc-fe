import { IconButton } from "@material-ui/core";
import {
  Edit,
  FileCopy,
  OpenInNew,
} from "@material-ui/icons";
import React from "react";
import { TableColumnActionProps } from "./types";

type Props<T> = TableColumnActionProps<T>;

const TableColumnAction = <T extends any>(): React.FunctionComponent<Props<T>> => ({
  actionType,
  rowData,
  onSelect,
}) => {
  const iconRenderer = () => {
    switch (actionType) {
      case "EDIT": return <Edit />;
      case "FILE_COPY": return <FileCopy />;
      case "PREVIEW": return <OpenInNew />; ;
    }
  };

  return (
    <IconButton onClick={onSelect && onSelect({rowData, actionType})}>
      {iconRenderer()}
    </IconButton>
  );
};

export default TableColumnAction;
