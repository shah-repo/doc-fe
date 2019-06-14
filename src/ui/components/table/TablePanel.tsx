import { Paper } from "@material-ui/core";
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
import { TablePanelProps } from "./types";

type Props<T> = TablePanelProps<T>;

export const TablePanel = <T extends any>(): React.FunctionComponent<Props<T>> => ({
  data,
  columns,
  noRowsTranslation,
}) => {

  const classes = styles();
  const noRowsRenderer = () => <Text translation={noRowsTranslation} />;

  const rowGetter = ({ index }: Index): T => {
    return data[index];
  };

  const tableRenderer = ({ height, width }: Size) => {
    return (
      <Table
        width={height}
        height={width}
        headerHeight={50}
        rowHeight={50}
        rowCount={data.length}
        className={classes.table}
        rowClassName={classes.cellRow}
        headerClassName={classes.headerRow}
        rowGetter={rowGetter}
        noRowsRenderer={noRowsRenderer}
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
    <Paper className={classes.root}>
      {bodyRenderer()}
    </Paper>
  );
};
