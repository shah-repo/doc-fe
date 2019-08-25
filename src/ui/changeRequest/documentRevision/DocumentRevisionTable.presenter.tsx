import { Paper, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import {
  DocumentRevision,
  DocumentRevisionsByIdState,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { SelectOption } from "../../components/forms/fields/Select";
import {
  TableColumnActionProps,
  TableColumnProps,
} from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSearchQueryType, TableSelectionProps } from "../../components/table/types";
import Text from "../../components/Text";
import { documentRevisionStatusOption } from "../../document.revision/utils/helpers";
import { documentRevisionIdMask } from "../../documentRevision/helpers";
import { Translation } from "../../translations/types";
import styles from "./DocumentRevisionTable.styles";
import { DocumentRevisionListItem } from "./types";

interface DocumentRevisionTableProps extends WithStyles<typeof styles> {
  documentRevisionsToShow: DocumentRevision[];
  addDocument: (documentRevisionId: string) => void;
  addedDocuments: string[];
}

const DocumentRevisionTable: React.FunctionComponent<
  DocumentRevisionTableProps
> = ({ classes, documentRevisionsToShow, addDocument, addedDocuments }) => {
  const onStateSelect = ({
    rowData,
  }: TableSelectionProps<DocumentRevision>) => () => {
    return addDocument(rowData.id);
  };

  const ChangeRequestList = TablePanel<DocumentRevision>();

  const options: SelectOption[] = [
    { value: DocumentRevisionStatus.Draft, text: DocumentRevisionStatus.Draft },
    {
      value: DocumentRevisionStatus.Released,
      text: DocumentRevisionStatus.Released,
    },
  ];

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (queryDict["status[]"]) { return queryDict; }
    queryDict["status[]"] = [
      DocumentRevisionStatus.Draft,
      DocumentRevisionStatus.Released,
    ];
    return queryDict;
  };

  const customDataSet = (data: DocumentRevision[]) =>
    data.filter((rec) => !addedDocuments.includes(rec.id));

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "name",
      label: "changeRequest.documentRevisionTable.name",
      columnOptions: { width: 50 },
    },
    {
      key: "version",
      label: "changeRequest.documentRevisionTable.version",
      columnOptions: { width: 10 },
    },
    {
      key: "owner",
      label: "changeRequest.documentRevisionTable.owner",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
        flexGrow: 1,
      },
    },
    {
      key: "status",
      label: "changeRequest.documentRevisionTable.state",
      onSelect: onStateSelect,
      columnOptions: { width: 80 },
      searchOptions: {
        dataKey: "status[]",
        searchType: "select",
        selectOptions: options,
      },
    },
    {
      key: "actions",
      label: "changeRequest.documentRevisionTable.add",
      cellType: "ACTION",
      omitSearch: true,
      onSelect: onStateSelect,
      columnOptions: { cellDataGetter: () => ["ADD"], width: 10 },
    },
  ];

  const bodyRenderer = () => {
    return (
      <ChangeRequestList
        columns={columns}
        tableData={documentRevisionsToShow}
        cellMeasure={true}
        queryUrl={DOCUMENT_REVISION_ROOT_URL}
        customQuerySet={customQuerySet}
        customDataSet={customDataSet}
      />
    );
  };

  return <Paper className={classes.root}>{bodyRenderer()}</Paper>;
};

export default withStyles(styles)(DocumentRevisionTable);
