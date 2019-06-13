import { Paper, WithStyles, withStyles, Button } from "@material-ui/core";
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
import { DocumentRevision, DocumentRevisionsByIdState, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import styles from "./DocumentRevisionTable.styles";
import {
  DocumentRevisionListItem,
} from "./types";

interface DocumentRevisionTableProps extends WithStyles<typeof styles> {
  documentRevisionsToShow: DocumentRevision[];
  addDocument: (documentRevisionId: string) => void;
}

const DocumentRevisionTable: React.FunctionComponent<DocumentRevisionTableProps> = ({
  classes, documentRevisionsToShow, addDocument
}) => {
  const rowGetter = ({ index }: Index): DocumentRevisionListItem => {
    const documentRevision = documentRevisionsToShow[index];
    const versionNumber = `000${documentRevision.document.typeCount}`;
    const version = `${documentRevision.type}${versionNumber.substr(versionNumber.length - 4)}`

    return {
      id: documentRevision.id,
      name: documentRevision.name,
      owner: documentRevision.owner.name,
      state: documentRevision.status,
      version,
    };
  };

  const actionsColumnCellRenderer = ({ rowIndex }: TableCellProps): React.ReactNode => {
    return (
      <div className={classes.actions}>
        {
          documentRevisionsToShow[rowIndex].status === DocumentRevisionStatus.Draft && (
            <Button onClick={() => addDocument(documentRevisionsToShow[rowIndex].id)} variant="contained" color="primary">
              <Text translation="changeRequest.documentRevisionTable.add" />
            </Button>
          )
        }
      </div>
    );
  };

  const renderColumn = (
    key: keyof DocumentRevisionListItem | "actions" | "version",
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
        rowCount={documentRevisionsToShow.length}
        className={classes.table}
        rowClassName={`${classes.tableRow} ${classes.flexContainer}`}
        rowGetter={rowGetter}
      >
        {renderColumn("name", "changeRequest.documentRevisionTable.name", { width: 50 })}
        {renderColumn("version", "changeRequest.documentRevisionTable.version", { width: 10 })}
        {renderColumn("owner", "changeRequest.documentRevisionTable.owner", { flexGrow: 2 })}
        {renderColumn("state", "changeRequest.documentRevisionTable.state", { width: 50 })}
        {actionsColumn}
      </Table>
    );
  };

  const bodyRenderer = () => {
    if (documentRevisionsToShow.length > 0) {
      return (
        <AutoSizer>
          {tableRenderer}
        </AutoSizer>
      );
    }

    return <Text translation="changeRequest.documentRevisionTable.noDocumentRevisions" />;
  };

  return (
    <Paper className={classes.root}>
      {bodyRenderer()}
    </Paper>
  );
};

export default withStyles(styles)(DocumentRevisionTable);
