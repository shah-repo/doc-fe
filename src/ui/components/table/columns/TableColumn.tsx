import React from "react";
import { CellMeasurer, CellMeasurerCache, Column, TableCellProps as ColumnProps } from "react-virtualized";
import Text from "../../Text";
import TableColumnAction from "./TableColumn.actions";
import {
  StyledCellLink,
  StyledTableCell,
  StyledTableHeader,
  StyledTooltip,
} from "./TableColumn.styles";
import {
  InnerTableColumnProps,
  TableCellProps,
  TableCellTypeRenderer,
  TableColumnProps,
} from "./types";

type Props<T> = TableColumnProps<T>;
type InnerProps = InnerTableColumnProps;

export function TableColumn<T>(props: Props<T>, innerProps: InnerProps) {

  const { key, label, cellType, columnOptions, cellOptions, hoverDataInfo = false, onSelect } = props;
  const { measurerCache } = innerProps;

  measurerCache.clearAll();
  const cellWhiteSpace = () => (measurerCache.hasFixedHeight()) ? "nowrap" : "initial";

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

  const cellTypeRenderer = ({ cellData, rowData }: ColumnProps) => {
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

  const cellMeasurer = ({ parent, dataKey, rowIndex, columnIndex, ... other }: any) => {
    return (
      <CellMeasurer
        key={dataKey}
        cache={measurerCache!}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        parent={parent}
      >
        <div style={{whiteSpace: cellWhiteSpace(), padding: "5px 0"}}>
          {cellTypeRenderer(other)}
        </div>
      </CellMeasurer>
    );
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

  const cellRenderer = (columnProps: ColumnProps) => {
    return (
      <StyledTableCell
        component="div"
        variant="body"
        align={"left"}
        {... cellOptions}
      >
        <StyledTooltip
          disableHoverListener={!hoverDataInfo}
          title={columnProps.cellData || ""}
        >
          <div>{cellMeasurer(columnProps)}</div>
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
