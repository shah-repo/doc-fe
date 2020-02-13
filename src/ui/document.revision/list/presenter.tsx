import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
// import { ReactComponent as LockIcon } from "../../../assets/images/icon_lock.svg";
// import { ReactComponent as UnlockIcon } from "../../../assets/images/icon_unlock.svg";
import { stripTagsFromObject } from "../../../common/utils/helpers";
import { unmaskId } from "../../../state/ducks/common/helpers";
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import Date from "../../components/Date";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
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
  editDocumentRevision,
  documentTypeOptions,
  tableName,
  tableCriteria,
  tableData,
  clearFilter,
}) => {
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);

  const typeTooltipRenderer = (rowData: DocumentRevision) =>
    rowData.document.documentType.documentTypeName || "";

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (!queryDict["status[]"]) {
      queryDict["status[]"] = documentRevisionQueryStatus();
    }

    queryDict.description = queryDict.name;

    return queryDict;
  };

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "docId",
      label: "document.revision.list.docId",
      cellHref: cellHrefRenderer,
      sortable: true,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.document.docId,
        width: 150,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict.docId,
      },
    },
    {
      key: "version",
      label: "common.version",
      searchOptions: {
        searchValueGetter: (value) => unmaskId(value),
        defaultValue: tableCriteria.queryDict.version,
      },
      cellOptions: { align: "center" },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData: { revision, revisionStage, revisionChangeType } }) =>
          generateVersionNumber(revision, revisionStage, revisionChangeType),
        width: 80,
        flexShrink: 1,
      },
    },
    {
      key: "name",
      label: "document.revision.list.name",
      tooltipKey: "description",
      cellHref: cellHrefRenderer,
      searchOptions: {
        defaultValue: tableCriteria.queryDict.name,
      },
    },
    {
      key: "documentTypeId" as keyof DocumentRevision,
      label: "document.revision.list.type",
      tooltipKey: typeTooltipRenderer,
      cellHref: cellHrefRenderer,
      searchOptions: {
        searchType: "select",
        selectOptions: documentTypeOptions,
        defaultValue: tableCriteria.queryDict.documentTypeId,
      },
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
        cellDataGetter: ({ rowData }) => rowData.owner.user.name,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict.owner,
      },
    },
    {
      key: "changeRequest",
      label: "common.crid",
      searchOptions: {
        dataKey: "crId",
        defaultValue: tableCriteria.queryDict.crId,
      },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) =>
          rowData.changeRequest && rowData.changeRequest.crId,
        width: 100,
      },
    },
    {
      key: "status",
      label: "document.revision.list.state",
      columnOptions: { width: 160 },
      cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
      onSelect: ({ rowData }) => () =>
        editDocumentRevision(rowData.id, rowData.document.id),
      searchOptions: {
        dataKey: "status[]",
        defaultValue: !tableCriteria.queryDict["status[]"]
          ? DocumentRevisionStatus.Released
          : _.isString(tableCriteria.queryDict["status[]"])
            ? tableCriteria.queryDict["status[]"]
            : undefined,
        searchType: "select",
        selectOptions: documentRevisionStatusOption(),
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
        defaultValue: tableCriteria.queryDict.releasedAfter,
      },
    },
    // We will add one more column if will be neccessery
    // {
    //   key: "grantAccess",
    //   label: "common.security",
    //   omitSearch: true,
    //   columnOptions: {
    //     cellDataGetter: ({ rowData }) => {
    //       if (rowData.document.canAccess) {
    //         return <UnlockIcon style={{marginLeft: 6}}/>;
    //       }
    //       return <LockIcon style={{marginLeft: 6}}/>;
    //     },
    //     width: 100,
    //   },
    // },
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
          onClick={clearFilter}
        >
          <Text translation="common.clear.filters" />
        </Button>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <Grid item={true} xs={6} style={{ textAlign: "right" }}>
        <RouterLink to={DOCUMENT_REVISION_CREATE_URL} className={classes.link}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            <Text translation="document.revision.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<DocumentRevision>
          columns={columns}
          queryUrl={DOCUMENT_REVISION_ROOT_URL}
          cellMeasure={true}
          customQuerySet={customQuerySet}
          customDataSet={customDataSet}
          sortBy={"docId"}
          tableName={tableName}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
