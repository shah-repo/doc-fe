import { Paper, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSearchQueryType, TableSelectionProps } from "../../components/table/types";
import { generateVersionNumber } from "../../documentRevision/helpers";
import styles from "./DocumentRevisionTable.styles";

interface DocumentRevisionTableProps extends WithStyles<typeof styles> {
  documentRevisionsToShow: DocumentRevision[];
  addDocument: (documentRevisionId: string) => void;
  addedDocuments: string[];
  tableName: string;
}

const DocumentRevisionTable: React.FunctionComponent<
  DocumentRevisionTableProps
> = ({ classes, tableName, addDocument, addedDocuments }) => {
  const onStateSelect = ({
    rowData,
  }: TableSelectionProps<DocumentRevision>) => () => {
    return addDocument(rowData.id);
  };

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    queryDict["status[]"] = [DocumentRevisionStatus.Draft];
    return queryDict;
  };

  const customDataSet = (data: DocumentRevision[]) =>
    data.filter((rec) => !addedDocuments.includes(rec.id));

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "docId",
      label: "document.revision.list.docId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.document.docId,
        width: 100,
      },
    },
    {
      key: "name",
      label: "changeRequest.documentRevisionTable.name",
      columnOptions: { flexGrow: 1 },
    },
    {
      key: "version",
      label: "changeRequest.documentRevisionTable.version",
      columnOptions: {
        cellDataGetter: ({ rowData: { revision, revisionStage }}) => generateVersionNumber(revision, revisionStage),
        width: 50,
      },
    },
    {
      key: "owner",
      label: "changeRequest.documentRevisionTable.owner",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
        flexGrow: 2,
      },
    },
    {
      key: "status",
      label: "changeRequest.documentRevisionTable.state",
      omitSearch: true,
      columnOptions: { width: 80 },
    },
    {
      key: "actions",
      label: "changeRequest.documentRevisionTable.add",
      cellType: "ACTION",
      omitSearch: true,
      onSelect: onStateSelect,
      columnOptions: { cellDataGetter: () => ["ADD"], width: 30 },
    },
  ];

  const bodyRenderer = () => {
    return (
      <TablePanel<DocumentRevision>
        columns={columns}
        cellMeasure={true}
        queryUrl={DOCUMENT_REVISION_ROOT_URL}
        customQuerySet={customQuerySet}
        customDataSet={customDataSet}
        tableName={tableName}
      />
    );
  };

  return <Paper className={classes.root}>{bodyRenderer()}</Paper>;
};

export default withStyles(styles)(DocumentRevisionTable);
