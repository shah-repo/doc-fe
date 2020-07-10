import { Button, Grid } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { DocumentType, PageDetailsColumn } from "../../../state/ducks/documentRevisions/documentType";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps, TableSearchQueryType } from "../../components/table/types";
import Text from "../../components/Text";
import { canEditDocumentRevision, documentRevisionQueryStatus, documentRevisionStatusOption } from "../../document.revision/utils/helpers";
import { documentEditPath, documentPreviewPath } from "../../document.revision/utils/paths";
import { Translation } from "../../translations/types";
import CreateDocumentByType from "./CreateDocumentByType";
import { columnSearchConfiguration, shouldShowStaticColumns } from "./helpers";
import { styles } from "./styles";

export interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<DocumentRevision>;
  clearFilter?: () => void;
  documentType: DocumentType;
}

export const DocumentByTypeListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableCriteria,
  tableData,
  clearFilter,
  documentType,
}) => {
  const showStaticColumns = shouldShowStaticColumns(documentType.documentTypeName);
  const classes = styles();
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  const queryUrl =
    DOCUMENT_REVISION_ROOT_URL + `?documentTypeId=${documentType.id}`;

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (!queryDict["status[]"]) {
      queryDict["status[]"] = documentRevisionQueryStatus();
    }

    return queryDict;
  };

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const pageDetailColumns = documentType.pageDetails?.columns || [];
  const additionalColumns = pageDetailColumns.map(
    (column: PageDetailsColumn) => {
      const [omitSearch, searchOptions] = columnSearchConfiguration(column.valuePath, tableCriteria);

      return {
        key: column.valuePath as keyof DocumentRevision,
        label: column.label as Translation,
        cellHref: cellHrefRenderer,
        omitSearch,
        columnOptions: {
          cellDataGetter: ({ rowData }) => _.get(rowData, column.valuePath),
        },
        searchOptions,
      };
    },
  );

  const staticColumns: TableColumnProps<DocumentRevision>[] = [
    {
      key: "docId",
      label: `${documentType.documentTypeName} ID` as Translation,
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
      key: "name",
      label: "document.title",
      tooltipKey: "name",
      cellHref: cellHrefRenderer,
      searchOptions: {
        defaultValue: tableCriteria.queryDict.name,
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
      key: "status",
      label: "common.state",
      columnOptions: { width: 160 },
      cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
      searchOptions: {
        dataKey: "status[]",
        defaultValue: _.isString(tableCriteria.queryDict["status[]"])
          ? tableCriteria.queryDict["status[]"]
          : undefined,
        searchType: "select",
        selectOptions: documentRevisionStatusOption(),
      },
    },
    {
      key: "changeRequest",
      label: "common.approval.id",
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
  ];
  const columns: TableColumnProps<DocumentRevision>[] = showStaticColumns ?
    [...staticColumns, ...additionalColumns] :
    [...additionalColumns];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button
          color="primary"
          variant="outlined"
          className={classes.clearButton}
          onClick={clearFilter}
          id="DocumentByTypeListPresenter-clearButton"
        >
          <Text translation="common.clear.filters" />
        </Button>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <CreateDocumentByType
        documentTypeName={documentType.documentTypeName}
        documentTypeId={documentType.id}
      />
      <Grid item={true} className={classes.item}>
        <TablePanel<DocumentRevision>
          columns={columns}
          queryUrl={queryUrl}
          cellMeasure={true}
          tableName={tableName}
          customQuerySet={customQuerySet}
        />
      </Grid>
    </Grid>
  );
};

export default DocumentByTypeListPresenter;
