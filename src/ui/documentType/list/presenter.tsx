import { Button, Grid } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import {
  DocumentType,
  PageDetailsColumn,
} from "../../../state/ducks/documentRevisions/documentType";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import {
  canEditDocumentRevision,
  documentRevisionStatusOption,
} from "../../document.revision/utils/helpers";
import {
  documentEditPath,
  documentPreviewPath,
} from "../../document.revision/utils/paths";
import { Translation } from "../../translations/types";
import { styles } from "./styles";
// import { FBTemplateSchema } from "../../form.builder/types/store";

export interface Props {
  tableName: string;
  tableState: TablePanelStateProps<DocumentRevision>;
  clearFilter?: () => void;
  documentType: DocumentType;
  openDocRev: () => void;
  showError: boolean;
}

export const DocumentByTypeListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableState,
  clearFilter,
  documentType,
  openDocRev,
  showError,
}) => {
  const classes = styles();
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  const queryUrl =
    DOCUMENT_REVISION_ROOT_URL + `?documentTypeId=${documentType.id}`;

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  const pageDetailColumns = documentType.pageDetails!.columns;
  const additionalColumns = pageDetailColumns.map(
    (column: PageDetailsColumn) => ({
      key: column.fieldName as keyof DocumentRevision,
      label: column.label as Translation,
      cellHref: cellHrefRenderer,
      omitSearch: true,
      columnOptions: {
        cellDataGetter: ({ rowData }) => {
          if (_.isUndefined(rowData.formInput)) {
            return "";
          }
          let fieldValue = rowData.formInput[column.fieldName] || "";
          fieldValue = fieldValue.replace(column.fieldName, "").replace("-<-val->", "");
          return _.startCase(fieldValue);
        }
      },
    }),
  );

  const columns: Array<TableColumnProps<DocumentRevision>> = [
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
        defaultValue: tableState.queryDict.docId,
      },
    },
    {
      key: "name",
      label: "supplier.name",
      tooltipKey: "name",
      cellHref: cellHrefRenderer,
      searchOptions: {
        defaultValue: tableState.queryDict.name,
      },
    },
    {
      key: "owner",
      label: "common.owner",
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.user.name,
      },
    },
    {
      key: "status",
      label: "common.state",
      columnOptions: { width: 160 },
      cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
      searchOptions: {
        dataKey: "status[]",
        defaultValue: _.isString(tableState.queryDict["status[]"])
          ? tableState.queryDict["status[]"]
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
        defaultValue: tableState.queryDict.crId,
      },
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) =>
          rowData.changeRequest && rowData.changeRequest.crId,
        width: 100,
      },
    },
    ...additionalColumns,
  ];

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
        <DocumentInfo numberOfRecords={tableState.queryData.length} />
      </Grid>
      <Grid item={true} xs={6} style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={openDocRev}
        >
          <Text translation="supplier.add.new" values={{name: documentType.documentTypeName}} />
        </Button>
      </Grid>
      {showError && <div style={{color: "red"}}>
        <Text translation="supplier.form.error" values={{name: documentType.documentTypeName}} />
      </div>}
      <Grid item={true} className={classes.item}>
        <TablePanel<DocumentRevision>
          columns={columns}
          queryUrl={queryUrl}
          cellMeasure={true}
          tableName={tableName}
        />
      </Grid>
    </Grid>
  );
};

export default DocumentByTypeListPresenter;
