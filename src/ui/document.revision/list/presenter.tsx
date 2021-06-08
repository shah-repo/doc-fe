import { Box, Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import { isEmpty, set } from "lodash";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { docRevSch } from "../../../common/normalizrSchema";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { convertHtmlEntities, stripTags } from "../../../common/utils/helpers";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { removeLastCharacterIfNotAlphaNumeric } from "../../common/utils/helpers";
import Date from "../../components/Date";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableSearchQueryType } from "../../components/table/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { checkIfDocumentHasOptions } from "../../documentRevision/helpers/checkDocumentGroup";
import useDialog from "../../hooks/useDialog";
import { canEditDocumentRevision, documentRevisionEffectiveDateOption, documentRevisionStatusOption } from "../utils/helpers";
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
  statuses,
}) => {
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  const dialog = useDialog();

  const typeTooltipRenderer = (rowData: DocumentRevision) =>
    rowData.document.documentType.documentTypeName || "";

  const textEditorTooltipRenderer = (rowData: DocumentRevision) =>
    convertHtmlEntities(stripTags(rowData.description || ""));

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    queryDict.description = queryDict.name;
    queryDict.documentTypeWithoutCategory = true;

    return queryDict;
  };

  const customDataSet = (data: DocumentRevision[]) => {
    const customData = data.reduce<DocumentRevision[]>((acc, docRev) => {
      if (!checkIfDocumentHasOptions(
        [
          DOC_TYPE_GROUP_OPTION.RECORD,
          DOC_TYPE_GROUP_OPTION.EQUIPMENT,
          DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD,
          DOC_TYPE_GROUP_OPTION.PART,
          DOC_TYPE_GROUP_OPTION.SUPPLIER,
          DOC_TYPE_GROUP_OPTION.PO,
          DOC_TYPE_GROUP_OPTION.RECEIVABLE,
        ],
        docRev.document.documentType.groupOptions
      )) {
        set(docRev, "description", stripTags(docRev.description));
        set(
          docRev,
          "document.documentType.documentTypeAcronym",
          removeLastCharacterIfNotAlphaNumeric(docRev.document?.documentType?.documentTypeAcronym)
        );
        acc.push(docRev);
      }
      return acc;
    }, []);
    return customData;
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
      // changed to displayRevision because
      // revision number calculation is now done on BE
      key: "displayRevision" as keyof DocumentRevision,
      label: "common.revision",
      searchOptions: {
        defaultValue: tableCriteria.queryDict.displayRevision,
      },
      cellOptions: { align: "center" },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.displayRevision,
        width: 80,
        flexShrink: 1,
      },
    },
    {
      key: "name",
      label: "document.revision.list.name",
      tooltipKey: textEditorTooltipRenderer,
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
      columnOptions: {
        cellDataGetter: ({ rowData }) => (rowData.displayStatus)?.toUpperCase(),
        width: 160,
      },
      cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
      onSelect: ({ rowData }) => () =>
        editDocumentRevision(rowData.id, rowData.document.id),
      searchOptions: {
        dataKey: "displayStatus",
        defaultValue: tableCriteria.queryDict.displayStatus,
        searchType: "select",
        selectOptions: documentRevisionStatusOption(statuses),
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

  const documentTypeSearchName = documentTypeOptions.find((e) =>
    e.value === tableCriteria.queryDict.documentTypeId)?.text;
  const effectiveDateSearch = documentRevisionEffectiveDateOption().find((e) =>
    e.value === tableCriteria.queryDict.effectiveDate)?.text;

  const headers = [
    { label: `DOC ID: ${tableCriteria.queryDict.docId  || ""}`, key: "docId" },
    { label: `REVISION: ${tableCriteria.queryDict.displayRevision  || ""}`, key: "displayRevision" },
    { label: `DOCUMENT TITLE: ${tableCriteria.queryDict.name  || ""}`, key: "documentTitle" },
    { label: `TYPE: ${documentTypeSearchName || ""}`, key: "type" },
    { label: `OWNER: ${tableCriteria.queryDict.owner || ""}`, key: "owner" },
    { label: `AR ID: ${tableCriteria.queryDict.crId || ""}`, key: "crId" },
    { label: `STATUS: ${tableCriteria.queryDict.displayStatus || ""}`, key: "status" },
    { label: `EFFECTIVE DATE: ${effectiveDateSearch || ""}`, key: "effectiveDate" },
  ];

  const renderTableData = () => {
    if (!isEmpty(tableData)) {
      return tableData.map((e) => ({
        docId: e.document.docId,
        displayRevision: e.displayRevision,
        documentTitle: e.name,
        type: e.document.documentType.documentTypeAcronym,
        owner: e.owner.user.name,
        crId: e.changeRequest?.crId || "",
        status: e.displayStatus.toUpperCase(),
        effectiveDate: e.effectiveDate ? getFormattedDateString(e.effectiveDate, MomentFormats.MonthDateYear) : "",
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };

  const data = dialog.isOpen ? renderTableData() : [];

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
          onClick={dialog.open}
        >
          <Box marginRight={1}>
            <ExportIcon className={classes.iconSvg} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          {...{ dialog, headers, data  }}
          customFileName="DocumentList"
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
          normalizrSchema={[docRevSch]}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
