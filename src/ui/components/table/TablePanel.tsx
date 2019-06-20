import { Box } from "@material-ui/core";
import React from "react";
import {
  AutoSizer,
  Index,
  Size,
  Table,
} from "react-virtualized";
import Text from "../../components/Text";
import { TableColumn } from "./columns/TableColumn";
import { styles } from "./TablePanel.styles";
import { TablePanelProps, TableStyleProps } from "./types";

type Props<T> = TablePanelProps<T>;

export const TablePanel = <T extends any>(): React.FunctionComponent<Props<T>> => ({
  data,
  columns,
  noRowsTranslation,
  onSelect,
}) => {

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

  const tableRenderer = ({ height, width }: Size) => {
    return (
      <Table
        width={width}
        height={height}
        headerHeight={50}
        rowHeight={50}
        rowCount={data.length}
        className={classes.table}
        rowClassName={rowClassName}
        headerClassName={classes.header}
        rowGetter={rowGetter}
        noRowsRenderer={noRowsRenderer}
        onRowClick={onSelect && (({rowData}) => onSelect({rowData})())}
      >
        {columns.map((item) => TableColumn<T>(item))}
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
