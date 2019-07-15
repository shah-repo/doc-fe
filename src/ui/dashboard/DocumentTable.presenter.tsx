import {  IconButton, Paper, WithStyles, withStyles } from "@material-ui/core";
import { Edit, FileCopy, OpenInNew } from "@material-ui/icons";
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
import { Document } from "../../state/ducks/documents";
import Text from "../components/Text";
import { canCloneDocument, canEditDocument } from "../documents/helpers";
import { Translation } from "../translations/types";
import styles from "./DocumentTable.styles";
import {
  DocumentActionProps,
  DocumentListItem,
} from "./types";

interface DocumentTableProps extends DocumentActionProps, WithStyles<typeof styles> {
  documents: Document[];
  currentUserEmail: string;
}

const DocumentTable: React.FunctionComponent<DocumentTableProps> = ({
  classes, documents, currentUserEmail, editDocument, previewDocument, cloneDocument,
}) => {
  const rowGetter = ({ index }: Index): DocumentListItem => {
    const document = documents[index];

    return {
      id: document.id,
      title: document.name,
      owner: document.owner.email,
      type: document.type,
      state: document.status,
    };
  };

  const actionsColumnCellRenderer = ({ rowIndex }: TableCellProps): React.ReactNode => {
    const document = documents[rowIndex];
    const canEdit = canEditDocument(document, currentUserEmail);
    const canClone = canCloneDocument(document);

    return (
      <div className={classes.actions}>
        {canEdit && <IconButton onClick={editDocument(document.id)}><Edit /></IconButton>}
        {canClone && <IconButton onClick={cloneDocument(document.id)}><FileCopy /></IconButton>}
        {<IconButton onClick={previewDocument(document.id)}><OpenInNew /></IconButton>}
      </div>
    );
  };

  const renderColumn = (
    key: keyof DocumentListItem | "actions",
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

  const actionsColumn = renderColumn("actions", "dashboard.table.actions", {
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
        rowCount={documents.length}
        className={classes.table}
        rowClassName={`${classes.tableRow} ${classes.flexContainer}`}
        rowGetter={rowGetter}
      >
        {renderColumn("title", "dashboard.table.title", { flexGrow: 2 })}
        {renderColumn("type", "dashboard.table.type", { width: 50 })}
        {renderColumn("owner", "common.owner", { flexGrow: 2 })}
        {renderColumn("state", "dashboard.table.state", { width: 50 })}
        {actionsColumn}
      </Table>
    );
  };

  const bodyRenderer = () => {
    if (documents.length > 0) {
      return (
        <AutoSizer>
          {tableRenderer}
        </AutoSizer>
      );
    }

    return <Text translation="dashboard.noDocuments" />;
  };

  return (
    <Paper className={classes.root}>
      {bodyRenderer()}
    </Paper>
  );
};

export default withStyles(styles)(DocumentTable);
