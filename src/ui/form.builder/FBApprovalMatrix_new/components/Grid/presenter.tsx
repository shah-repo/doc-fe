import React from "react";
import { KendoGrid } from "../../../../components/KendoGrid/KendoGrid";
import { KendoPresenterProps } from "./types";

const GridPresenter: React.FC<KendoPresenterProps> = (props) => {
  const { tableName, tableCriteria, schema, defaultPayloadData } = props;

  return (
    <KendoGrid
      tableName={tableName}
      tableCriteria={tableCriteria}
      schema={schema}
      exportDataChanges={() => ""}
      onRowClick={() => ""}
      queryUrl={""}
      defaultPayloadData={defaultPayloadData}
    />
  );
};

export default GridPresenter;
