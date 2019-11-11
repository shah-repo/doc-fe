import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { stripTagsFromObject } from "../../../common/utils/helpers";
import { unmaskId } from "../../../state/ducks/common/helpers";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import Date from "../../components/Date";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSearchQueryType } from "../../components/table/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { generateVersionNumber } from "../../documentRevision/helpers";
import {
  canEditDocumentRevision,
  documentRevisionQueryStatus,
  documentRevisionReleasedDateOption,
  documentRevisionStatusOption,
} from "../utils/helpers";
import { documentEditPath, documentPreviewPath } from "../utils/paths";
import { DocumentRevisionsUserProps } from "../utils/types";
import styles from "./styles";
export type Props = DocumentRevisionsUserProps & WithStyles<typeof styles>;

export const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  currentUserEmail,
  editDocumentRevision,
  setDocId,
  documentTypeOptions,
}) => {
  const ALL_DOC_REV_STATES = "ALL_DOC_REV_STATES";
  const [clearFilter, setClearFilter] = React.useState<boolean>(false);

  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);

  // TODO: fix tolltip
  const typeTooltipRenderer = (rowData: DocumentRevision) =>
    rowData.document.documentType.documentTypeName || "";

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const clear = () => setClearFilter(!clearFilter);

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (!queryDict["status[]"]) {
      queryDict["status[]"] = DocumentRevisionStatus.Released;
    } else if (queryDict["status[]"] === ALL_DOC_REV_STATES) {
      queryDict["status[]"] = documentRevisionQueryStatus();
    }

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
      label: "common.version",
      searchOptions: { searchValueGetter: (value) => unmaskId(value) },
      cellOptions: { align: "center" },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData: { revision, revisionStage }}) => generateVersionNumber(revision, revisionStage),
        width: 80,
        flexShrink: 1,
      },
    },
    {
      key: "name",
      label: "document.revision.list.name",
      tooltipKey: "description",
      cellHref: cellHrefRenderer,
    },
    {
      key: "documentTypeId",
      label: "document.revision.list.type",
      tooltipKey: typeTooltipRenderer,
      cellHref: cellHrefRenderer,
      searchOptions: { searchType: "select", selectOptions: documentTypeOptions },
      columnOptions: {
        cellDataGetter: ({ rowData }) => {
          return rowData.document.documentType.documentTypeAcronym;
        },
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
        searchValueGetter: (query) => {
          if (!query) {
            return ALL_DOC_REV_STATES;
          }
          return query;
        },
      },
    },
    {
      key: "releasedAt",
      label: "document.revision.released.date",
      cellHref: cellHrefRenderer,
      cellOptions: { align: "center" },
      columnOptions: {
        width: 115,
        cellDataGetter: ({ rowData }) => <Date value={rowData.releasedAt} />,
      },
      searchOptions: {
        dataKey: "releasedAfter",
        searchType: "select",
        selectOptions: documentRevisionReleasedDateOption(),
      },
    },
  ];

  const customDataSet = (data: DocumentRevision[]) =>
    data.map((docRev) => stripTagsFromObject(docRev));

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button
          color="primary"
          variant="outlined"
          className={classes.clearButton}
          onClick={clear}
        >
          <Text translation="common.clear.filters" />
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
        <TablePanel<DocumentRevision>
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
