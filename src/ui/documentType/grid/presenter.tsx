import { Grid } from "@material-ui/core";
import { cloneDeep, has, map } from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { KendoGrid } from "../../components/KendoGrid/KendoGrid";
import KendoGridStyles from "../../components/KendoGrid/KendoGrid.styles";
import { TableDataProps } from "../../components/table/types";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import { isTranslation } from "../../translations/types";
import CreateDocumentByType from "../list/CreateDocumentByType";
import { KendoPresenterProps } from "./interfaces";

export function DocumentTypePresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  headerColumns,
  title,
  onRowClick,
  queryUrl,
  documentTypeCategory,
  isByCategory,
  documentType,
  documentCategory,
}: KendoPresenterProps) {
  const classes = KendoGridStyles();
  const ref = useRef(tableName);
  useEffect(() => {
    ref.current = tableName;
  }, [tableName]);
  const [dataToBeExported, setDataToBeExported] = useState<DocumentRevision[]>([]);
  const intl = useIntl();
  const headers = headerColumns.map((column) => {
    if (
      moment(
        tableCriteria.queryDict?.[column.searchOptions?.dataKey || ""],
        moment.ISO_8601,
        true
      ).isValid()
    ) {
      return {
        label: column.label.split(" ").map((word) => word[0].toUpperCase() + word.substring(1)).join(" "),
        key: column.key,
      };
    }

    const columnLabel = isTranslation(column.label)
      ? intl.formatMessage({ id: column.label })
      : column.label;

    return {
      label: columnLabel.split(" ").map((word) => word[0].toUpperCase() + word.substring(1)).join(" "),
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
  const handleExportData = (
    dataToBeExported: TableDataProps<DocumentRevision>
  ) => {
    let copyDate = cloneDeep(dataToBeExported);
    copyDate = map(copyDate, (record: any) => {
      if (has(record, "precalc.lhr_end_accepted_quantity")) {
        if (record.precalc.lhr_end_accepted_quantity === -1) {
          record.precalc.lhr_end_accepted_quantity = "N/A";
        }
      }
      return record;
    });
    setDataToBeExported(copyDate);
  };
  const isGrouped = tableCriteria?.queryDict?.dataState?.group?.length > 0;
  return (
    <Grid container>
      <Grid item xs={12} className={classes.headerGridItem}>
        <CreateDocumentByType
          {...createDocumentProps}
          {...{ isByCategory, headers, tableData: dataToBeExported, isGrouped }}
          labelName={
            isByCategory
              ? documentCategory.addNewBtnLabel
              : documentType.documentTypeName
          }
        />
      </Grid>
      <Grid item xs={12} className={classes.kendoGridItem}>
        {ref.current === tableName && <KendoGrid
          tableName={tableName}
          tableCriteria={tableCriteria}
          schema={schema}
          statuses={statuses}
          exportDataChanges={handleExportData}
          onRowClick={onRowClick}
          queryUrl={queryUrl}
          defaultPayloadData={{
            documentTypeCategory: "Record",
            status: documentRevisionQueryStatus(),
          }}
          documentTypeCategory={documentTypeCategory}
        />}
      </Grid>
    </Grid>
  );
}
