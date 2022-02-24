import { Grid } from "@material-ui/core";
import { DataResult, State } from "@progress/kendo-data-query";
import {
  Grid as KendoTable, GridColumn as KendoColumn, GridDataStateChangeEvent, GridFilterCellProps, GridToolbar,
} from "@progress/kendo-react-grid";
import { set } from "lodash";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AutoSizer, Size } from "react-virtualized";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import { DisplayText, setColumnWidth, TranslatedText } from "../../components/common/kendo/helpers";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import { DataLoader } from "./DataLoader";
import { DocumentTypeFilterTemplate } from "./filter.template/DocumentTypeFilterTemplate";
import { EffectiveDateFilterTemplate } from "./filter.template/EffectiveDateFilterTemplate";
import { StatusFilterTemplate } from "./filter.template/StatusFilterTemplate";
import { KendoGridProps } from "./interfaces";
import KendoGridStyles from "./KendoGrid.styles";

export function KendoGrid({
  tableName,
  tableCriteria,
  schema,
  columns,
  statuses = [],
}: KendoGridProps<DocumentRevision>) {
  const classes = KendoGridStyles();
  console.log("debug :: KendoPanel");
  console.log("debug :: columns", columns);
  const dispatch = useDispatch();
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
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState: e.dataState,
          },
        },
        tableName
      )
    );
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
      <KendoColumn
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
  const clearFilter = () => {
    set(dataState, "filter.filters", []);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            dataState,
          },
        },
        tableName
      )
    );
  };
  // Render Kendo Columns
  const renderKendoGrid = ({ width }: Size) => (
    <>
      <KendoGlobalization>
        <KendoTable
          style={{ width: `${width}px` }}
          className={classes.grid}
          filterable={true}
          sortable={true}
          pageable={true}
          {...dataState}
          data={products}
          onDataStateChange={dataStateChange}
        >
          <GridToolbar>
            <Grid container>
              <Grid item={true} xs={6} style={{ textAlign: "left" }}>
                <ClearFilters {...{ clearFilter }} />
              </Grid>
              <Grid item={true} xs={6} style={{ textAlign: "right" }}>
                {/* <ColumnShowHideMenu
                  columnDefinition={sortedColumnDefinitions}
                  onChange={onColumnShowHide}
                /> */}
              </Grid>
            </Grid>
          </GridToolbar>
          {renderKendoColumns(width)}
        </KendoTable>

        {dataState && (
          <DataLoader
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
