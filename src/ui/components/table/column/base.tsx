import { Box, Tooltip } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { CellMeasurer, Column, SortDirectionType, SortIndicator, TableCellProps as ColumnProps } from "react-virtualized";
import Text from "../../Text";
import { TableSearchSelectField } from "../search/select";
import { TableSearchTextField } from "../search/text";
import TableColumnAction from "./action";
import { StyledCellLink, StyledTableCell, StyledTableHeader } from "./styles";
import { InnerTableColumnProps, TableCellProps, TableColumnProps } from "./types";

type Props<T> = TableColumnProps<T>;
type InnerProps = InnerTableColumnProps;

export function TableColumn<T>(props: Props<T>, innerProps: InnerProps) {
  const {
    key,
    label,
    cellType,
    columnOptions,
    cellOptions,
    tooltipKey,
    onSelect,
    searchOptions,
    omitSearch,
    cellHref,
    sortable = true,
  } = props;
  const { measurerCache, searchable, queryGetter } = innerProps;

  measurerCache.clearAll();
  const cellWhiteSpace = () =>
    measurerCache.hasFixedHeight() ? "nowrap" : "initial";

  const handleClick = ({ rowData }: TableCellProps<T>) => (
    e: React.MouseEvent,
  ) => {
    if (onSelect) {
      onSelect({ rowData })();
      e.stopPropagation();
    }
  };

  const cellLinkType = ({ cellData, rowData }: TableCellProps<T>) => (
    <StyledCellLink
      variant="subtitle2"
      onClick={handleClick({ cellData, rowData })}
    >
      {cellData}
    </StyledCellLink>
  );

  const cellActionType = ({ cellData, rowData }: TableCellProps<T>) => cellData.map((actionType) => {
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

  const cellTypeRenderer = ({ cellData, rowData }: ColumnProps) => {
    let type = cellType;
    if (typeof cellType === "function") {
      type = (cellType)(rowData);
    }
    switch (type) {
      case "LINK":
        return cellLinkType({ cellData, rowData });
      case "ACTION":
        return cellActionType({ cellData, rowData });
      default:
        return cellData;
    }
  };

  const cellMeasurer = ({ parent, rowIndex, columnIndex, ...other }: any) => (
    <CellMeasurer
      key={key}
      cache={measurerCache}
      rowIndex={rowIndex}
      columnIndex={columnIndex}
      parent={parent}
    >
      <div style={{ whiteSpace: cellWhiteSpace(), padding: "5px 0" }}>
        {cellTypeRenderer(other)}
      </div>
    </CellMeasurer>
  );

  const searchFieldRenderer = () => {
    if (omitSearch === true) {
      return <Box style={{ background: "transparent", height: 62 }} />;
    }
    const searchType = searchOptions ? searchOptions.searchType : "text";
    switch (searchType) {
      case "select":
        return (
          <TableSearchSelectField
            dataKey={key}
            queryGetter={queryGetter}
            {...searchOptions}
          />
        );
      default:
        return (
          <TableSearchTextField
            dataKey={key}
            queryGetter={queryGetter}
            {...searchOptions}
          />
        );
    }
  };

  const headerRenderer = (props: {
    dataKey: string;
    sortBy?: string | undefined;
    sortDirection?: SortDirectionType | undefined;
  }): React.ReactNode => (
    <StyledTableHeader component="div" variant="head">
      <Box component="div" className="columnBox">
        <Box height="50px" pt={2} pl={1}>
          <Text message={label} />

          {sortable && <SortIndicator sortDirection={props.sortDirection} />}
        </Box>
        {searchable && (
          <Box height="65px" component="div" className="headerField">
            {searchFieldRenderer()}
          </Box>
        )}
      </Box>
    </StyledTableHeader>
  );

  const tooltipRenderer = (columnProps: ColumnProps) => {
    const { rowData } = columnProps;
    let tooltipValue: string = rowData[tooltipKey] || "";
    if (typeof tooltipKey === "function") {
      tooltipValue = (tooltipKey)(rowData);
    }

    return (
      <Tooltip disableHoverListener={!tooltipKey} title={tooltipValue || ""}>
        <div>{cellMeasurer(columnProps)}</div>
      </Tooltip>
    );
  };

  const linkRenderer = (columnProps: ColumnProps) => {
    const { rowData } = columnProps;
    if (cellHref) {
      return (
        <Link
          className="columnLink"
          component={RouterLink}
          to={cellHref(rowData)}
        >
          {tooltipRenderer(columnProps)}
        </Link>
      );
    }
    return tooltipRenderer(columnProps);
  };

  const cellRenderer = (columnProps: ColumnProps) => (
    <StyledTableCell
      component="div"
      variant="body"
      align="left"
      {...cellOptions}
    >
      {linkRenderer(columnProps)}
    </StyledTableCell>
  );

  return (
    <Column
      key={key}
      dataKey={key}
      width={200}
      flexGrow={1}
      disableSort={!sortable}
      headerRenderer={headerRenderer}
      cellRenderer={cellRenderer}
      {...columnOptions}
    />
  );
}
