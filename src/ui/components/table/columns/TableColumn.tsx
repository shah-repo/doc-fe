import { Box } from "@material-ui/core";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import React from "react";
import { CellMeasurer, Column, TableCellProps as ColumnProps } from "react-virtualized";
import Text from "../../Text";
import TableColumnAction from "./TableColumn.actions";
import {
  StyledCellLink,
  StyledTableCell,
  StyledTableField,
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
  const { measurerCache, searchable } = innerProps;

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

  const searchFieldRenderer = () => (
    <Box component="div" className="headerField">
      <StyledTableField
        name={key}
        // onChange={handleChange("name")}
        margin="normal"
        InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
      />
    </Box>
  );

  const headerRenderer = () => {
    return (
      <StyledTableHeader component="div" variant="head" >
        <Box component="div" className="columnBox" >
          <Box component="div" className="headerText" >
            <Text translation={label} />
          </Box>
          {searchable && searchFieldRenderer()}
        </Box>
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
