import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { TableColumnProps } from "../components/table/columns/types";
import { TablePanel } from "../components/table/TablePanel";
import { TableSelectionProps } from "../components/table/types";
import Text from "../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../constants/urls";
import styles from "./List.styles";
import { canEditDocumentRevision } from "./utils/helpers";
import { documentRevisionIdMask } from "./utils/helpers";
import { DocumentRevisionsUserProps } from "./utils/types";

type Props = DocumentRevisionsUserProps & WithStyles<typeof styles>;

const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  documentRevisions,
  currentUserEmail,
  editDocumentRevision,
  previewDocumentRevision,
}) => {

  const DocumentList = TablePanel<DocumentRevision>();

  const stateCellTypeRenderer = (rowData: DocumentRevision) => {
    const documentRevision = rowData;
    const canEdit = canEditDocumentRevision({documentRevision, currentUserEmail});
    return (canEdit) ? "LINK" : "BASE";
  };

  const onStateSelect = ({rowData}: TableSelectionProps<DocumentRevision>) => () => {
    return editDocumentRevision(rowData.id);
  };

  const onRowSelect = ({rowData}: TableSelectionProps<DocumentRevision>) => () => {
    return previewDocumentRevision(rowData.id);
  };

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "docId",
      label: "document.revision.list.docId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => documentRevisionIdMask(rowData.type, rowData.document.typeCount),
        width: 150,
      },
    },
    {
      key: "version",
      label: "document.revision.list.version",
      columnOptions: {
        cellDataGetter: ({ rowData }) => `V${rowData.version}`,
        flexShrink: 2,
      },
      cellOptions: { align: "center" },
    },
    {
      key: "name",
      label: "document.revision.list.name",
      hoverDataInfo: true,
    },
    {
      key: "type",
      label: "document.revision.list.type",
      columnOptions: { width: 100 },
    },
    {
      key: "owner",
      label: "document.revision.list.owner",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
      },
    },
    {
      key: "status",
      label: "document.revision.list.state",
      cellType: stateCellTypeRenderer,
      onSelect: onStateSelect,
      columnOptions: { width: 160 },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid container={true} justify="flex-end">
        <RouterLink to={DOCUMENT_REVISION_CREATE_URL} className={classes.link}>
          <Button variant="contained" color="primary" className={classes.button}>
            <Text translation="document.revision.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <DocumentList
          data={documentRevisions}
          columns={columns}
          noRowsTranslation="document.revision.list.noRows"
          onSelect={onRowSelect}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
