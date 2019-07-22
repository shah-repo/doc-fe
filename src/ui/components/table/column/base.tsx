import { Box } from "@material-ui/core";
import React from "react";
import {
  CellMeasurer,
  Column,
  TableCellProps as ColumnProps,
} from "react-virtualized";
import Text from "../../Text";
import { TableSearchSelectField } from "../search/select";
import { TableSearchTextField } from "../search/text";
import TableColumnAction from "./action";
import {
  StyledCellLink,
  StyledTableCell,
  StyledTableHeader,
  StyledTooltip,
} from "./styles";
import {
  InnerTableColumnProps,
  TableCellProps,
  TableCellTooltipRenderer,
  TableCellTypeRenderer,
  TableColumnProps,
} from "./types";

type Props<T> = TableColumnProps<T>;
type InnerProps = InnerTableColumnProps;

export function TableColumn<T>(props: Props<T>, innerProps: InnerProps) {

  const { key, label, cellType, columnOptions, cellOptions, tooltipKey, onSelect, searchOptions } = props;
  const { measurerCache, searchable, queryGetter } = innerProps;

  measurerCache.clearAll();
  const cellWhiteSpace = () => (measurerCache.hasFixedHeight()) ? "nowrap" : "initial";

  const handleClick = ({rowData}: TableCellProps<T>) => (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect({rowData})();
      e.stopPropagation();
    }
  };

  const cellLinkType = ({cellData, rowData}: TableCellProps<T>) => {
    return (
      <StyledCellLink variant="subtitle2" onClick={handleClick({cellData, rowData})} >
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

  const cellMeasurer = ({ parent, rowIndex, columnIndex, ... other }: any) => {
    return (
      <CellMeasurer
        key={key}
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

  const searchFieldRenderer = () => {
    const searchType = (searchOptions) ? searchOptions.searchType : "text";
    switch (searchType) {
      case "select":
          return <TableSearchSelectField dataKey={key} queryGetter={queryGetter} {...searchOptions} />;
      default:
        return <TableSearchTextField dataKey={key} queryGetter={queryGetter} {...searchOptions} />;
    }
  };

  const headerRenderer = () => {
    return (
      <StyledTableHeader component="div" variant="head" >
        <Box component="div" className="columnBox" >
          <Box component="div" className="headerText" >
            <Text translation={label} />
          </Box>
          {searchable && <Box component="div" className="headerField">{searchFieldRenderer()}</Box>}
        </Box>
      </StyledTableHeader>
    );
  };

  const tooltipRenderer = (columnProps: ColumnProps) => {
    let tooltipValue: string = columnProps.rowData[tooltipKey] || "";
    if (typeof tooltipKey === "function") {
      tooltipValue = (tooltipKey as TableCellTooltipRenderer<T>)(columnProps.rowData);
    }

    return (
      <StyledTooltip
        disableHoverListener={!tooltipKey}
        title={tooltipValue || ""}
      >
        <div>{cellMeasurer(columnProps)}</div>
      </StyledTooltip>
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
        {tooltipRenderer(columnProps)}
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
