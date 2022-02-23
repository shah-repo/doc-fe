import { DataResult, State } from "@progress/kendo-data-query";
import {
  Grid, GridColumn as Column, GridDataStateChangeEvent, GridFilterCellProps,
} from "@progress/kendo-react-grid";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { AutoSizer, Size } from "react-virtualized";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import { DisplayText, setColumnWidth, TranslatedText } from "../../components/common/kendo/helpers";
import KendoGlobalization from "../../components/KendoGlobalization";
import { DocumentTypeFilterTemplate } from "./filter.template/DocumentTypeFilterTemplate";
import { EffectiveDateFilterTemplate } from "./filter.template/EffectiveDateFilterTemplate";
import { StatusFilterTemplate } from "./filter.template/StatusFilterTemplate";
import { KendoPanelProps } from "./interfaces";
import { ProductsLoader } from "./ProductsLoader";


export function KendoPanel({
  tableName,
  tableCriteria,
  schema,
  columns,
  statuses,
}: KendoPanelProps) {
  console.log("debug :: KendoPanel");
  console.log("debug :: columns", columns);

  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const [dataState, setDataState] = React.useState<State>(tableCriteria.queryDict.dataState);

  useEffect(() => {
    setDataState(tableCriteria.queryDict.dataState);
  }, [tableCriteria]);

  const [products, setProducts] = React.useState<DataResult>({
    data: [],
    total: 77,
  });

  const dataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState(e.dataState);
  };

  const dataReceived = (products: DataResult) => {
    setProducts(products);
  };

  // Column Menu Filters
  const StatusFilter = (props: GridFilterCellProps) => (
    <StatusFilterTemplate
      {...props}
      data={statuses as DocumentRevisionStatus[]}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const TypeFilter = (props: GridFilterCellProps) => (
    <DocumentTypeFilterTemplate
      {...props}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );
  const EffectiveDate = (props: GridFilterCellProps) => (
    <EffectiveDateFilterTemplate
      {...props}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );

  const filterCellMapping = {
    "displayStatus": StatusFilter,
    "document.documentType.documentTypeAcronym": TypeFilter,
    "effectiveDate": EffectiveDate,
  };

  const renderKendoColumns = (
    gridWidth: number
  ) => (
    columns.map((column, index) => (
      <Column
        key={index}
        {...column}
        title={getTranslatedText(column.title)}
        width={setColumnWidth(column.width as number, gridWidth)}
        minResizableWidth={200}
        headerCell={
          column.title ? (props) => <ColumnHeader {...props} /> : undefined
        }
        cell={undefined}
        filterCell={
          filterCellMapping[column.field]
            ? filterCellMapping[column.field]
            : undefined
        }
        columnMenu={undefined}
      />)
    ));

  // Render Kendo Columns
  const renderKendoGrid = ({ width }: Size) => (
    <>
      <KendoGlobalization>
        <Grid
          style={{ width: `${width}px` }}
          filterable={true}
          sortable={true}
          pageable={true}
          {...dataState}
          data={products}
          onDataStateChange={dataStateChange}
        >
          {renderKendoColumns(width)}
        </Grid>

        {dataState && (
          <ProductsLoader
            dataState={dataState}
            onDataReceived={dataReceived}
            schema={schema}
            tableName={tableName}
          />
        )}
      </KendoGlobalization>
    </>
  );
  const renderBody = () => <AutoSizer>{renderKendoGrid}</AutoSizer>;
  return (
    <>
      <div style={{ color: "red" }}>{""}</div>
      {renderBody()}
    </>
  );
}
