import {  IconButton, Paper, WithStyles, withStyles } from "@material-ui/core";
import { Edit, OpenInNew } from "@material-ui/icons";
import React from "react";
import {
  AutoSizer,
  Column,
  ColumnProps,
  Index,
  Size,
  Table,
  TableCellProps,
} from "react-virtualized";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import styles from "./ChangeRequestTable.styles";
import { canEditChangeRequest } from "./helpers";
import {
  ChangeRequestActionProps,
  ChangeRequestListItem,
} from "./types";

interface ChangeRequestTableProps extends ChangeRequestActionProps, WithStyles<typeof styles> {
  changeRequests: ChangeRequest[];
  currentUserEmail: string;
}

const ChangeRequestTable: React.FunctionComponent<ChangeRequestTableProps> = ({
  classes, changeRequests, currentUserEmail, editChangeRequest, previewChangeRequest,
}) => {
  const rowGetter = ({ index }: Index): ChangeRequestListItem => {
    const changeRequest = changeRequests[index];

    return {
      id: changeRequest.id,
      description: changeRequest.description,
      owner: changeRequest.owner.user.name,
      state: changeRequest.state,
    };
  };

  const actionsColumnCellRenderer = ({ rowIndex }: TableCellProps): React.ReactNode => {
    const changeRequest = changeRequests[rowIndex];
    const canEdit = canEditChangeRequest(changeRequest, currentUserEmail);

    return (
      <div className={classes.actions}>
        {canEdit && <IconButton onClick={editChangeRequest(changeRequest.id)}><Edit /></IconButton>}
        {<IconButton onClick={previewChangeRequest(changeRequest.id)}><OpenInNew /></IconButton>}
      </div>
    );
  };

  const renderColumn = (
    key: keyof ChangeRequestListItem | "actions",
    label: Translation,
    columnOptions?: Partial<ColumnProps>,
  ) => {
    return (
      <Column
        label={<Text translation={label} />}
        dataKey={key}
        className={classes.flexContainer}
        headerClassName={classes.flexContainer}
        width={100}
        flexGrow={1}
        {...columnOptions}
      />
    );
  };

  const actionsColumn = renderColumn("actions", "changeRequest.table.actions", {
    cellRenderer: actionsColumnCellRenderer,
    headerClassName: classes.actions,
  });

  const tableRenderer = ({ height, width }: Size) => {
    return (
      <Table
        width={width}
        height={height}
        headerHeight={50}
        rowHeight={50}
        rowCount={changeRequests.length}
        className={classes.table}
        rowClassName={`${classes.tableRow} ${classes.flexContainer}`}
        rowGetter={rowGetter}
      >
        {renderColumn("description", "changeRequest.table.description", { flexGrow: 5 })}
        {renderColumn("owner", "changeRequest.table.owner", { flexGrow: 2 })}
        {renderColumn("state", "changeRequest.table.state", { width: 50 })}
        {actionsColumn}
      </Table>
    );
  };

  const bodyRenderer = () => {
    if (changeRequests.length > 0) {
      return (
        <AutoSizer>
          {tableRenderer}
        </AutoSizer>
      );
    }

    return <Text translation="changeRequest.table.noChangeRequests" />;
  };

  return (
    <Paper className={classes.root}>
      {bodyRenderer()}
    </Paper>
  );
};

export default withStyles(styles)(ChangeRequestTable);
