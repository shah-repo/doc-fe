import { Box, Grid } from "@material-ui/core";
import { cloneDeep, has, map, startCase } from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { KendoGrid } from "../../components/KendoGrid/KendoGrid";
import { TableDataProps } from "../../components/table/types";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import Colors from "../../layout/theme/utils/colors";
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
        label: startCase(column.label),
        key: column.key,
      };
    }

    const columnLabel = isTranslation(column.label)
      ? intl.formatMessage({ id: column.label })
      : column.label;

    return {
      label: startCase(columnLabel),
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
          // eslint-disable-next-line @typescript-eslint/camelcase
          record.precalc.lhr_end_accepted_quantity = "N/A";
        }
      }
      if (has(record, "precalc.po_amount")) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        record.precalc.po_amount = record.precalc.po_amount_org;
      }
      return record;
    });
    setDataToBeExported(copyDate);
  };
  return (
    <Box p={2} style={{ background: Colors.background_white }}>
      <Grid container={true}>
        <CreateDocumentByType
          {...createDocumentProps}
          {...{ isByCategory, headers, tableData: dataToBeExported }}
          labelName={
            isByCategory
              ? documentCategory.addNewBtnLabel
              : documentType.documentTypeName
          }
        />
        <Grid item={true} xs={12}>
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
    </Box>
  );
}
