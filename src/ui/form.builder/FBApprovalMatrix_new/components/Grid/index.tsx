import React from "react";
import { AutoSizer } from "react-virtualized";
import KendoGlobalization from "../../../../components/KendoGlobalization";
import { Grid as KendoGrid } from "@progress/kendo-react-grid";
import KendoColumn from "../GridColumn";
import { GridProps } from "./types";

const Grid: React.FC<GridProps> = (props) => {
  const { data } = props;

  return (
    <AutoSizer>
      {({ width }) => (
        <KendoGlobalization>
          <KendoGrid
            style={{ width: `${width}px` }}
            data={data?.approvalMatrix}
          >
            <KendoColumn
              title="Status"
              field="docType.acronym"
            />
            <KendoColumn
              title="Prefix"
              field="docType.acronym"
            />
            <KendoColumn
              title="Internal type"
              field="docType.group"
            />
            <KendoColumn
              title="Document type"
              field="docType.name"
            />
          </KendoGrid>
        </KendoGlobalization>
      )}
    </AutoSizer>
  );
};

export default Grid;
