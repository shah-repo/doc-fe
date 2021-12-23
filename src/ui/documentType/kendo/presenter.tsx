import { Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { docRevSch } from "../../../common/normalizrSchema";
import { DocumentType, PageDetails } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { TableColumnProps } from "../../components/table/column/types";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import { documentRevisionEffectiveDateOption } from "../../document.revision/utils/helpers";
import { isTranslation } from "../../translations/types";
import CreateDocumentByType from "../list/CreateDocumentByType";
import { KendoGrid } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  providedData: TableDataProps<DocumentRevision>;
  clearFilter?: () => void;
  documentType: DocumentType;
  queryUrl: string;
  columns: TableColumnProps<DocumentRevision>[];
  dynamicColumns: any;
  isByCategory: boolean;
  documentCategory: PageDetails;
}

const DocumentByTypeListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  dynamicColumns,
  providedData,
  documentType,
  queryUrl,
  columns,
  isByCategory,
  documentCategory,
  tableCriteria,  // TODO: Check while doing filter to save in localstorage
}) => {
  const classes = KendoGridStyles();
  const intl = useIntl();
  const headers = columns.map((column) => {
    if (
      moment(
        tableCriteria.queryDict?.[column.searchOptions?.dataKey || ""],
        moment.ISO_8601,
        true
      ).isValid()
    ) {
      const dateSearchString = documentRevisionEffectiveDateOption().find(
        (e) =>
          e.value ===
          tableCriteria.queryDict?.[column.searchOptions?.dataKey || ""]
      )?.text;
      return {
        label: `${column.label}: ${dateSearchString || ""}`,
        key: column.key,
      };
    }

    const columnLabel = isTranslation(column.label)
      ? intl.formatMessage({ id: column.label })
      : column.label;

    return {
      label: `${columnLabel}: ${tableCriteria.queryDict?.[
        column.searchOptions?.dataKey ||
        column.searchOptions?.defaultValue ||
        ""
      ] ||
        column.searchOptions?.defaultValue ||
        ""
      }`,
      key: column.key,
    };
  });
  const createDocumentProps = isByCategory
    ? {
      categoryName: documentCategory.category,
    }
    : {
      documentTypeId: documentType.id,
    };
  return (
    <Grid container={true} className={classes.root}>
      <CreateDocumentByType
        {...createDocumentProps}
        {...{ isByCategory, headers, tableData: providedData }}
        labelName={
          isByCategory
            ? documentCategory.addNewBtnLabel
            : documentType.documentTypeName
        }
      />
      <Grid item={true}>
        <KendoGrid<DocumentRevision>
          dynamicColumns={dynamicColumns}
          tableName={tableName}
          gridData={providedData}
          tableCriteria={tableCriteria}
          queryUrl={queryUrl}
          normalizrSchema={[docRevSch]}
        />
      </Grid>
    </Grid>
  ); }
;

export default DocumentByTypeListPresenter;
