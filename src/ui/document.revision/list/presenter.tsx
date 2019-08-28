import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { unmaskId } from "../../../state/ducks/common/helpers";
import { DocumentRevision, DocumentRevisionType } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSearchQueryType } from "../../components/table/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import {
  canEditDocumentRevision,
  documentRevisionQueryStatus,
  documentRevisionStatusOption,
  documentRevisionTypeOption} from "../utils/helpers";
import { documentEditPath, documentPreviewPath } from "../utils/paths";
import { DocumentRevisionsUserProps } from "../utils/types";
import styles from "./styles";
import { stripTagsFromObject } from "../../../common/utils/helpers";

type Props = DocumentRevisionsUserProps & WithStyles<typeof styles>;

const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  currentUserEmail,
  editDocumentRevision,
  setDocId,
}) => {
  const DocumentList = TablePanel<DocumentRevision>();
  const [clearFilter, setClearFilter] = React.useState<boolean>(false);

  const canEdit = (data: DocumentRevision) => canEditDocumentRevision({dataProp: data, currentUserEmail});

  const typeTooltipRenderer = (rowData: DocumentRevision) =>
    DocumentRevisionType[rowData.document.type as unknown as keyof typeof DocumentRevisionType];

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const clear = () => setClearFilter(!clearFilter);

  const onCreateClick = () => setDocId("");

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (queryDict["status[]"]) { return queryDict; }
    queryDict["status[]"] = documentRevisionQueryStatus();
    return queryDict;
  };

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "docId",
      label: "document.revision.list.docId",
      cellHref: cellHrefRenderer,
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
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => `V${rowData.version}`,
        width: 170,
        flexShrink: 2,
      },
    },
    {
      key: "name",
      label: "document.revision.list.name",
      tooltipKey: "description",
      cellHref: cellHrefRenderer,
    },
    {
      key: "type",
      label: "document.revision.list.type",
      tooltipKey: typeTooltipRenderer,
      cellHref: cellHrefRenderer,
      searchOptions: { searchType: "select", selectOptions: documentRevisionTypeOption() },
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.document.type,
        width: 100,
      },
    },
    {
      key: "owner",
      label: "common.owner",
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
      },
    },
    {
      key: "changeRequest",
      label: "common.crid",
      searchOptions: { dataKey: "crId" },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.changeRequest && rowData.changeRequest.crId,
        width: 100,
      },
    },
    {
      key: "status",
      label: "document.revision.list.state",
      columnOptions: { width: 160 },
      cellType: (rowData) => (canEdit(rowData)) ? "LINK" : "BASE",
      onSelect: ({rowData}) => () => editDocumentRevision(rowData.id, rowData.document.id),
      searchOptions: {
        dataKey: "status[]",
        searchType: "select",
        selectOptions: documentRevisionStatusOption(),
      },
    },
  ];

  const customDataSet = (data: DocumentRevision[]) =>
    data.map((docRev) => stripTagsFromObject(docRev) as DocumentRevision)

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button color="primary" className={classes.clearButton} onClick={clear} >
          Clear filters
        </Button>
      </Grid>
      <Grid item={true} xs={6} style={{textAlign: "right"}}>
        <RouterLink onClick={(onCreateClick)} to={DOCUMENT_REVISION_CREATE_URL} className={classes.link}>
          <Button variant="contained" color="primary" className={classes.button}>
            <Text translation="document.revision.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <DocumentList
          tableData={dataProp}
          columns={columns}
          queryUrl={DOCUMENT_REVISION_ROOT_URL}
          clearFilter={clearFilter}
          cellMeasure={true}
          customQuerySet={customQuerySet}
          customDataSet={customDataSet}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
