import React from "react";
import { Column } from "react-virtualized";
import Text from "../../Text";
import TableColumnAction from "./TableColumn.actions";
import {
  StyledCellLink,
  StyledTableCell,
  StyledTableHeader,
} from "./TableColumn.styles";
import { TableColumnActionType, TableColumnProps } from "./types";

type Props<T> = TableColumnProps<T>;

export function TableColumn<T>({
  key,
  label,
  cellType,
  columnOptions,
  cellOptions,
  onSelect,
}: Props<T>) {

  const cellLinkType = (cellData: any, rowData: any) => {
    return (
      <StyledCellLink
        variant="subtitle2"
        onClick={onSelect && onSelect({rowData})}
      >
        {cellData}
      </StyledCellLink>
    );
  };

  const cellActionType = (cellData: TableColumnActionType[], rowData: T) => {
    return cellData.map((actionType) => {
      const ActionColumn = TableColumnAction<T>();
      return (
        <ActionColumn
          key={"action-" + actionType}
          actionType={actionType}
          rowData={rowData}
          onSelect={onSelect}
        />
      );
    });
  };

  const cellTypeRenderer = (cellData: any, rowData: T) => {
    switch (cellType) {
      case "LINK": return cellLinkType(cellData, rowData);
      case "ACTION": return cellActionType(cellData, rowData);
      default: return cellData;
    }
  };

  const headerRenderer = () => {
    return (
      <StyledTableHeader
        component="div"
        variant="head"
      >
        <Text translation={label} />
      </StyledTableHeader>
    );
  };

  const cellRenderer = ({ cellData , rowData }: any) => {
    return (
      <StyledTableCell
        component="div"
        variant="body"
        align={"left"}
        {... cellOptions}
      >
        {cellTypeRenderer(cellData, rowData)}
      </StyledTableCell>
    );
  };

  return (
    <Column
      key={key}
      dataKey={key}
      width={200}
      flexGrow={1}
      headerRenderer={headerRenderer}
      cellRenderer={cellRenderer}
      {...columnOptions}
    />
  );
}
