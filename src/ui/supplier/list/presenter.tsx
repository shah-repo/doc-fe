import { Button, Grid } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  DocumentRevision,
} from "../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { SelectOption } from "../../components/forms/fields/Select";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { canEditDocumentRevision } from "../../document.revision/utils/helpers";
import { documentEditPath, documentPreviewPath } from "../../document.revision/utils/paths";
import { Translation } from "../../translations/types";
import { styles } from "./styles";

export interface Props {
  tableName: string;
  tableState: TablePanelStateProps<DocumentRevision>;
  clearFilter?: () => void;
  groupOptions: SelectOption[];
}

export const SuppliersListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableState,
  clearFilter,
  groupOptions,
}) => {
  const documentType: any = [
    {
      createdAt: "2019-12-16T09:19:39.612Z",
      updatedAt: "2019-12-16T09:19:39.612Z",
      id: "a7d4537c-935c-45a4-966d-f5266201d680",
      documentTypeName: "Page Details Example",
      documentTypeAcronym: "PDE",
      group: "OTHER",
      privateNumberPool: false,
      startingNumber: 1,
      pageDetails: {
        addNew: {
          label: "Label",
        },
        columns: [
          {
            label: "Label",
            fieldName: "Field Name",
          },
        ],
      },
    },
  ];
  const classes = styles();
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  const queryUrl =
    DOCUMENT_REVISION_ROOT_URL;
  // const pageDetailColumns = documentType.pageDetails!.columns;

  const cellHrefRenderer = (rowData: DocumentRevision): string => {
    if (canEdit(rowData)) {
      return documentEditPath(rowData.id, rowData.document.id);
    }
    return documentPreviewPath(rowData.id, rowData.document.id);
  };

  /*
  const additionalColumns = pageDetailColumns.map((column: DocumentPageDetailColumn) => ({
    key: column.label,
    label: `document.revision.list.${column.label.toLowerCase()}` as Translation,
    cellHref: cellHrefRenderer,
    columnOptions: {
      cellDataGetter: ({ rowData }) => rowData.formInput ? rowData.formInput[column.fieldName] : "",
    },
  }));
  */

  const columns: Array<TableColumnProps<DocumentRevision>> = [
    {
      key: "docId",
      // label: `document.revision.list.${documentType.documentTypeName.toLowerCase()}.id` as Translation,
      label: "Doc id" as Translation,
      cellHref: cellHrefRenderer,
      sortable: true,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.document.docId,
        width: 150,
      },
    },
    {
      key: "name",
      // label: `document.revision.list.${documentType.documentTypeName.toLowerCase()}.name` as Translation,
      label: "Name" as Translation,
      tooltipKey: "name",
      cellHref: cellHrefRenderer,
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
      label: "document.revision.list.state",
      columnOptions: { width: 160 },
      cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
    },
    {
      key: "approvalId" as keyof DocumentRevision,
      label: "document.revision.list.approvalId" as Translation,
      cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
      columnOptions: {
        cellDataGetter: ({ rowData }) =>
          rowData.document.changeRequest
            ? rowData.document.changeRequest.crId
            : "",
        width: 160,
      },
    },
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
        <RouterLink to={DOCUMENT_REVISION_CREATE_URL} className={classes.link}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            <Text message={`Add ${documentType.documentTypeName}`} />
          </Button>
        </RouterLink>
      </Grid>
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

export default SuppliersListPresenter;
