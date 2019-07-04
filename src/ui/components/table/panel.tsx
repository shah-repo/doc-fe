import { Box } from "@material-ui/core";
import React from "react";
import {
  AutoSizer,
  CellMeasurerCache,
  Index,
  Size,
  Table,
} from "react-virtualized";
import Text from "../../components/Text";
import { TableColumn } from "./column/base";
import { styles } from "./styles";
import { TablePanelProps, TableStyleProps } from "./types";

type Props<T> = TablePanelProps<T>;

export const TablePanel = <T extends any>(): React.FunctionComponent<Props<T>> => ({
  data,
  columns,
  noRowsTranslation,
  cellMeasure = false,
  onSelect,
  searchable = true,
}) => {

  const headerHeight = (searchable) ? 120 : 50;
  const styleProps: TableStyleProps = { isSelectable: (onSelect !== undefined) };
  const classes = styles(styleProps);
  const noRowsRenderer = () => <Text translation={noRowsTranslation} />;

  const rowGetter = ({ index }: Index): T => {
    return data[index];
  };

  const rowClassName = ({ index }: Index) => {
    return (index % 2 === 0) ?
    `${classes.row} ${classes.rowEven}` :
    `${classes.row} ${classes.rowOdd}`;
  };

  const measurerCache = new CellMeasurerCache({
    fixedWidth: true,
    fixedHeight: !cellMeasure,
    minHeight: 50,
  });

  const tableRenderer = ({ height, width }: Size) => {
    return (
      <Table
        width={width}
        height={height}
        headerHeight={headerHeight}
        rowHeight={measurerCache.rowHeight}
        deferredMeasurementCache={measurerCache}
        rowCount={data.length}
        className={classes.table}
        rowClassName={rowClassName}
        headerClassName={classes.header}
        rowGetter={rowGetter}
        noRowsRenderer={noRowsRenderer}
        onRowClick={onSelect && (({rowData}) => onSelect({rowData})())}
      >
        {columns.map((item) => TableColumn<T>(item, { measurerCache, searchable }))}
      </Table>
    );
  };

  const bodyRenderer = () => {
    return (
      <AutoSizer>
        {tableRenderer}
      </AutoSizer>
    );
  };

  return (
    <Box className={classes.root}>
      {bodyRenderer()}
    </Box>
  );
};
