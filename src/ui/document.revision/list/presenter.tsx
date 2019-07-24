import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { unmaskId } from "../../../state/ducks/common/helpers";
import { DocumentRevision, DocumentRevisionType } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSelectionProps } from "../../components/table/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import {
  canEditDocumentRevision,
  documentRevisionStatusOption,
  documentRevisionTypeOption } from "../utils/helpers";
import { DocumentRevisionsUserProps } from "../utils/types";
import styles from "./styles";

type Props = DocumentRevisionsUserProps & WithStyles<typeof styles>;

const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  currentUserEmail,
  editDocumentRevision,
  previewDocumentRevision,
}) => {

  const DocumentList = TablePanel<DocumentRevision>();
  const [clearFilter, setClearFilter] = React.useState<boolean>(false);

  const stateCellTypeRenderer = (rowData: DocumentRevision) => {
    const documentRevision = rowData;
    const canEdit = canEditDocumentRevision({dataProp: documentRevision, currentUserEmail});
    return (canEdit) ? "LINK" : "BASE";
  };

  const onStateSelect = ({rowData}: TableSelectionProps<DocumentRevision>) => () => {
    return editDocumentRevision(rowData.id, rowData.document.id);
  };

  const onRowSelect = ({rowData}: TableSelectionProps<DocumentRevision>) => () => {
    return previewDocumentRevision(rowData.id, rowData.document.id);
  };

  const typeTooltipRenderer = (rowData: DocumentRevision) =>
    DocumentRevisionType[rowData.document.type as unknown as keyof typeof DocumentRevisionType];

  const clear = () => setClearFilter(!clearFilter);

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "docId",
      label: "document.revision.list.docId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.document.docId,
        width: 150,
      },
    },
    {
      key: "version",
      label: "document.revision.list.version",
      searchOptions: { searchValueGetter: (value) => unmaskId(value) },
      cellOptions: { align: "center" },
      columnOptions: {
        cellDataGetter: ({ rowData }) => `V${rowData.version}`,
        width: 150,
        flexShrink: 2,
      },
    },
    {
      key: "name",
      label: "document.revision.list.name",
      searchOptions: { dataKey: "title" },
      tooltipKey: "description",
    },
    {
      key: "type",
      label: "document.revision.list.type",
      tooltipKey: typeTooltipRenderer,
      searchOptions: { searchType: "select", selectOptions: documentRevisionTypeOption() },
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.document.type,
        width: 100,
      },
    },
    {
      key: "owner",
      label: "common.owner",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
      },
    },
    {
      key: "changeRequest",
      label: "common.crid",
      searchOptions: { dataKey: "crId" },
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.changeRequest && rowData.changeRequest.crId,
        width: 100,
      },
    },
    {
      key: "status",
      label: "document.revision.list.state",
      cellType: stateCellTypeRenderer,
      onSelect: onStateSelect,
      columnOptions: { width: 160 },
      searchOptions: {
        dataKey: "status[]",
        searchType: "select",
        selectOptions: documentRevisionStatusOption(),
      },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button color="secondary" className={classes.clearButton} onClick={clear} >
          Clear filters
        </Button>
      </Grid>
      <Grid item={true} xs={6} style={{textAlign: "right"}}>
        <RouterLink to={DOCUMENT_REVISION_CREATE_URL} className={classes.link}>
          <Button variant="contained" color="primary" className={classes.button}>
            <Text translation="document.revision.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <DocumentList
          tableData={dataProp}
          columns={columns}
          onSelect={onRowSelect}
          queryUrl={DOCUMENT_REVISION_ROOT_URL}
          clearFilter={clearFilter}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
