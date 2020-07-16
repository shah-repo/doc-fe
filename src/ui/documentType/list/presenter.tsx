import { Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps, TableSearchQueryType } from "../../components/table/types";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import CreateDocumentByType from "./CreateDocumentByType";
import { styles } from "./styles";

export interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<DocumentRevision>;
  clearFilter?: () => void;
  documentType: DocumentType;
  queryUrl: string;
  columns: TableColumnProps<DocumentRevision>[];
}

export const DocumentByTypeListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
  clearFilter,
  documentType,
  queryUrl,
  columns,
}) => {
  const classes = styles();

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (!queryDict["status[]"]) {
      queryDict["status[]"] = documentRevisionQueryStatus();
    }

    return queryDict;
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      {documentType && <CreateDocumentByType
        documentTypeName={documentType.documentTypeName}
        documentTypeId={documentType.id}
      />}
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
