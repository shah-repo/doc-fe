import { Grid } from "@material-ui/core";
import { isString } from "lodash";
import moment from "moment";
import React from "react";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DocumentType, PageDetails } from "../../../state/ducks/documentRevisions/documentType";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps, TableSearchQueryType } from "../../components/table/types";
import { documentRevisionEffectiveDateOption, documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
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

  // currently status column by default has all types, need an empty string for csv
  const formedTableCriteria = () => {
    if (isString(tableCriteria.queryDict["status[]"])) {
      return tableCriteria.queryDict;
    }
    return {
      ...tableCriteria.queryDict,
      "status[]": "",
    };
  };

  const headers =
    columns.map((column) => {
      if (moment(formedTableCriteria().queryDict?.[column.searchOptions?.dataKey || ""],
        moment.ISO_8601, true).isValid()) {
        const dateSearchString = documentRevisionEffectiveDateOption().find((e) =>
          e.value === formedTableCriteria().queryDict?.[column.searchOptions?.dataKey || ""])?.text;
        return {
          label: `${column.label}: ${dateSearchString || ""}`,
          key: column.key,
        };
      }
      return {
        label: `${column.label}: ${formedTableCriteria().queryDict?.[column.searchOptions?.dataKey || ""] || ""}`,
        key: column.key,
      };
    });

  const data = tableData.map((e) => {
    const deepValue = (o, p) => p.split(".").reduce((a, v) => a[v], o);
    const h = headers.map((column) => {
      if (moment(deepValue(e, column.key), moment.ISO_8601, true).isValid()) {
        return {
          [column.key]: getFormattedDateString(deepValue(e, column.key), MomentFormats.MonthDateYear) || "",
        };
      }
      return { [column.key]: deepValue(e, column.key) || "" };
    });
    const rows = h.reduce(function(result, current) {
      return Object.assign(result, current);
    }, {});
    return rows;
  });

  const customQuerySet = (queryDict: TableSearchQueryType) => {
    if (!queryDict["status[]"]) {
      queryDict["status[]"] = documentRevisionQueryStatus();
    }

    return queryDict;
  };

  const createDocumentProps = isByCategory ? {
    categoryName: documentCategory.category,
  } : {
    documentTypeId: documentType.id,
  };

  const supportExportList = documentCategory.exportList;

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <CreateDocumentByType
        {...createDocumentProps}
        {...{ isByCategory, headers, data, supportExportList }}
        labelName={isByCategory ? documentCategory.addNewBtnLabel : documentType.documentTypeName}
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
