import { Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DocumentType, PageDetails } from "../../../state/ducks/documentRevisions/documentType";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import { documentRevisionEffectiveDateOption } from "../../document.revision/utils/helpers";
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
  isByCategory: boolean;
  documentCategory: PageDetails;
}

export const DocumentByTypeListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
  clearFilter,
  documentType,
  queryUrl,
  columns,
  isByCategory,
  documentCategory,
  tableCriteria,
}) => {
  const classes = styles();
  const intl = useIntl();

  const headers =
    columns.map((column) => {
      if (moment(tableCriteria.queryDict?.[column.searchOptions?.dataKey || ""],
        moment.ISO_8601, true).isValid()) {
        const dateSearchString = documentRevisionEffectiveDateOption().find((e) =>
          e.value === tableCriteria.queryDict?.[column.searchOptions?.dataKey || ""])?.text;
        return {
          label: `${column.label}: ${dateSearchString || ""}`,
          key: column.key,
        };
      }
      return {
        label: `${intl.formatMessage({ id: column.label })}: ${tableCriteria.queryDict?.[column.searchOptions?.dataKey || column.searchOptions?.defaultValue || ""] || column.searchOptions?.defaultValue || ""}`,
        key: column.key,
      };
    });

  const createDocumentProps = isByCategory ? {
    categoryName: documentCategory.category,
  } : {
    documentTypeId: documentType.id,
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <CreateDocumentByType
        {...createDocumentProps}
        {...{ isByCategory, headers, tableData }}
        labelName={isByCategory ? documentCategory.addNewBtnLabel : documentType.documentTypeName}
      />
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
