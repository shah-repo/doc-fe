import { DataResult, State } from "@progress/kendo-data-query";
import {
  Grid,
  GridColumn as Column,
  GridDataStateChangeEvent,
} from "@progress/kendo-react-grid";
import React from "react";
import { AutoSizer, Size } from "react-virtualized";
import KendoGlobalization from "../../components/KendoGlobalization";
import { ProductsLoader } from "./ProductsLoader";

export function KendoPanel<T>() {
  console.log("debug :: KendoPanel");

  const [products, setProducts] = React.useState<DataResult>({
    data: [],
    total: 77,
  });

  const [dataState, setDataState] = React.useState<State>({
    take: 10,
    skip: 0,
  });

  const dataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState(e.dataState);
  };

  const dataReceived = (products: DataResult) => {
    setProducts(products);
  };


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
          <Column field="ProductID" filter="numeric" title="Id" />
          <Column field="ProductName" title="Name" />
          <Column
            field="UnitPrice"
            filter="numeric"
            format="{0:c}"
            title="Price"
          />
          <Column field="UnitsInStock" filter="numeric" title="In stock" />
        </Grid>

        <ProductsLoader dataState={dataState} onDataReceived={dataReceived} />
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


