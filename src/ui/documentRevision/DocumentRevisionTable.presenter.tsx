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
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import styles from "./DocumentRevisionTable.styles";
import { canEditDocumentRevision, documentRevisionIdMask } from "./helpers";
import {
  DocumentRevisionActionProps,
  DocumentRevisionListItem,
} from "./types";

export interface DocumentRevisionTableProps extends DocumentRevisionActionProps, WithStyles<typeof styles> {
  documentRevisions: DocumentRevision[];
  currentUserEmail: string;
}

// TODO: check if this can be deleted
export const DocumentRevisionTable: React.FunctionComponent<DocumentRevisionTableProps> = ({
  classes, documentRevisions, currentUserEmail, editDocumentRevision, previewDocumentRevision,
}) => {
  const rowGetter = ({ index }: Index): DocumentRevisionListItem => {
    const documentRevision = documentRevisions[index];

    return {
      id: documentRevision.document.docId,
      revision: documentRevision.revision,
      description: documentRevision.description,
      name: documentRevision.name,
      owner: documentRevision.owner.name,
      status: documentRevision.status,
      type: documentRevision.document.documentType.documentTypeName,
    };
  };

  const actionsColumnCellRenderer = ({ rowIndex }: TableCellProps): React.ReactNode => {
    const documentRevision = documentRevisions[rowIndex];
    const canEdit = canEditDocumentRevision(documentRevision, currentUserEmail);

    return (
      <div className={classes.actions}>
        {canEdit && <IconButton onClick={editDocumentRevision(documentRevision.id, documentRevision.document.id)}><Edit /></IconButton>}
        {<IconButton onClick={previewDocumentRevision(documentRevision.id, documentRevision.document.id)}><OpenInNew /></IconButton>}
      </div>
    );
  };

  const renderColumn = (
    key: keyof DocumentRevisionListItem | "actions",
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
    width: 70,
  });

  const tableRenderer = ({ height, width }: Size) => {
    return (
      <Table
        width={width}
        height={height}
        headerHeight={50}
        rowHeight={50}
        rowCount={documentRevisions.length}
        className={classes.table}
        rowClassName={`${classes.tableRow} ${classes.flexContainer}`}
        rowGetter={rowGetter}
      >
        {renderColumn("id", "changeRequest.documentRevisionTable.id", { width:  60 })}
        {renderColumn("revision", "changeRequest.documentRevisionTable.revision", { width: 50 })}
        {renderColumn("description", "changeRequest.documentRevisionTable.description", { flexGrow: 4 })}
        {renderColumn("name", "changeRequest.documentRevisionTable.name", { flexGrow: 3 })}
        {renderColumn("owner", "changeRequest.documentRevisionTable.owner", { flexGrow: 2 })}
        {renderColumn("status", "changeRequest.documentRevisionTable.state", { flexGrow: 3 })}
        {renderColumn("type", "changeRequest.documentRevisionTable.type", { width:  50 })}
        {actionsColumn}
      </Table>
    );
  };

  const bodyRenderer = () => {
    if (documentRevisions.length > 0) {
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

export default withStyles(styles)(DocumentRevisionTable);
