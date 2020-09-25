import { Box, Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import { isString, set } from "lodash";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { stripTags } from "../../../common/utils/helpers";
import { unmaskId } from "../../../state/ducks/common/helpers";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { removeLastCharacterIfNotAlphaNumeric } from "../../common/utils/helpers";
import Date from "../../components/Date";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableSearchQueryType } from "../../components/table/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { generateVersionNumber } from "../../documentRevision/helpers";
import useDialog from "../../hooks/useDialog";
import { canEditDocumentRevision, documentRevisionEffectiveDateOption, documentRevisionQueryStatus, documentRevisionStatusOption } from "../utils/helpers";
import { documentEditPath, documentPreviewPath } from "../utils/paths";
import { DocumentRevisionsUserProps } from "../utils/types";
import ExportListDialog from "./ExportListDialog/ExportListDialog";
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

  const columns: TableColumnProps<DocumentRevision>[] = [
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
      key: "revision",
      label: "common.revision",
      searchOptions: {
        searchValueGetter: (value) => unmaskId(value),
        defaultValue: tableCriteria.queryDict.revision,
      },
      cellOptions: { align: "center" },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => generateVersionNumber(
          rowData.revision,
          rowData.revisionStage,
          rowData.subRevision,
          rowData.revisionChangeType,
          rowData.status,
        ),
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
        cellDataGetter: ({ rowData }) => rowData.document.documentType.documentTypeAcronym,
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
        defaultValue: isString(tableCriteria.queryDict["status[]"])
          ? tableCriteria.queryDict["status[]"]
          : undefined,
        searchType: "select",
        selectOptions: documentRevisionStatusOption(),
      },
    },
    {
      key: "effectiveDate",
      label: "common.effective.date",
      cellHref: cellHrefRenderer,
      cellOptions: { align: "center" },
      columnOptions: {
        width: 115,
        // eslint-disable-next-line react/display-name
        cellDataGetter: ({ rowData }) => <Date value={rowData.effectiveDate} />,
      },
      searchOptions: {
        dataKey: "effectiveDate",
        searchType: "select",
        selectOptions: documentRevisionEffectiveDateOption(),
        defaultValue: tableCriteria.queryDict.effectiveDate,
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

  const customDataSet = (data: DocumentRevision[]) => {

    /** Temp fix - disabling filtering by document type name.
     * Remove .map and uncomment .reduce to enable filtering. */
    const customData = data
      .map((docRev) => {
        set(docRev, "description", stripTags(docRev.description));
        set(
          docRev,
          "document.documentType.documentTypeAcronym",
          removeLastCharacterIfNotAlphaNumeric(docRev.document?.documentType?.documentTypeAcronym)
        );
        return docRev;
      });

    /*    const customData = data.reduce<DocumentRevision[]>((acc, docRev) => {
        if (docRev.document.documentType.documentTypeName
         && DOCUMENT_LIST_TYPE_NAMES.includes(docRev.document.documentType.documentTypeName)) {
          set(docRev, "description", stripTags(docRev.description));
          set(
            docRev,
            "document.documentType.documentTypeAcronym",
            removeLastCharacterIfNotAlphaNumeric(docRev.document?.documentType?.documentTypeAcronym)
          );
          acc.push(docRev);
        }
        return acc;
      }, []); */

    return customData;
  };

  const data = tableData.map((e) => ({
    docId: e.document.docId,
    revision: e.revision,
    documentTitle: e.name,
    type: e.document.documentType.documentTypeAcronym,
    owner: e.owner.user.name,
    crId: e.changeRequest?.crId,
    status: e.status,
    effectiveDate: e.effectiveDate ? getFormattedDateString(e.effectiveDate, MomentFormats.MonthDateYear) : "",
  }));

  const documentTypeSearchName = documentTypeOptions.find((e) =>
    e.value === tableCriteria.queryDict.documentTypeId)?.text;
  const effectiveDateSearch = documentRevisionEffectiveDateOption().find((e) =>
    e.value === tableCriteria.queryDict.effectiveDate)?.text;

  const headers = [
    { label: `DOC ID: ${tableCriteria.queryDict.docId  || ""}`, key: "docId" },
    { label: `REVISION: ${tableCriteria.queryDict.revision  || ""}`, key: "revision" },
    { label: `DOCUMENT TITLE: ${tableCriteria.queryDict.name  || ""}`, key: "documentTitle" },
    { label: `TYPE: ${documentTypeSearchName || ""}`, key: "type" },
    { label: `OWNER: ${tableCriteria.queryDict.owner || ""}`, key: "owner" },
    { label: `AR ID: ${tableCriteria.queryDict.crId || ""}`, key: "crId" },
    { label: `STATUS: ${tableCriteria.queryDict["status[]"] || ""}`, key: "status" },
    { label: `EFFECTIVE DATE: ${effectiveDateSearch || ""}`, key: "effectiveDate" },
  ];

  const dialog = useDialog();
  const [fileName, saveFileName] = useState("");
  const handleOpen = () => {
    dialog.open();
    saveFileName("");
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <Grid item={true} xs={6} style={{ textAlign: "right", marginBottom: "16px" }}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          style={{ marginRight: 5 }}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={handleOpen}
        >
          <Box marginRight={1}>
            <ExportIcon className={classes.iconSvg} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          {...{ dialog, headers, data, fileName, saveFileName }}
        />
        <RouterLink to={DOCUMENT_REVISION_CREATE_URL} className={classes.link}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            id="ListPresenter-create"
            data-cy="document.revision.create"
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
