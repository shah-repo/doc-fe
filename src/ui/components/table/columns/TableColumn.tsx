import React from "react";
import { Column } from "react-virtualized";
import Text from "../../Text";
import TableColumnAction from "./TableColumn.actions";
import {
  StyledCellLink,
  StyledTableCell,
  StyledTableHeader,
  StyledTooltip,
} from "./TableColumn.styles";
import {
  TableCellProps,
  TableCellTypeRenderer,
  TableColumnProps,
} from "./types";

type Props<T> = TableColumnProps<T>;

export function TableColumn<T>({
  key,
  label,
  cellType,
  columnOptions,
  cellOptions,
  hoverDataInfo = false,
  onSelect,
}: Props<T>) {

  const handleClick = ({rowData}: TableCellProps<T>) => (e: React.MouseEvent<HTMLElement>) => {
    if (onSelect) {
      onSelect({rowData})();
      e.stopPropagation();
    }
  };

  const cellLinkType = ({cellData, rowData}: TableCellProps<T>) => {
    return (
      <StyledCellLink
        variant="subtitle2"
        onClick={handleClick({cellData, rowData})}
      >
        {cellData}
      </StyledCellLink>
    );
  };

  const cellActionType = ({cellData, rowData}: TableCellProps<T>) => {
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
    let type = cellType;
    if (cellType as TableCellTypeRenderer<T>) {
      type = (cellType as TableCellTypeRenderer<T>)(rowData);
    }
    switch (type) {
      case "LINK": return cellLinkType({cellData, rowData});
      case "ACTION": return cellActionType({cellData, rowData});
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

  const cellRenderer = ({ cellData, rowData }: any) => {
    return (
      <StyledTableCell
        component="div"
        variant="body"
        align={"left"}
        {... cellOptions}
      >
        <StyledTooltip disableHoverListener={!hoverDataInfo} title={cellData}>
          <div>{cellTypeRenderer(cellData, rowData)}</div>
        </StyledTooltip>
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
