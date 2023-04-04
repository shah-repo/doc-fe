import React from "react";
import {
  Grid as KendoGrid,
  GridColumn as KendoColumnOrigin,
  GridColumnProps as KendoColumnProps,
} from "@progress/kendo-react-grid";
import { useIntl } from "react-intl";
import { AutoSizer } from "react-virtualized";
import KendoGlobalization from "../../../../components/KendoGlobalization";
import ColumnHeader from "../../../../components/common/kendo/ColumnHeader";
import { GridPresenterProps } from "./types";

const KendoColumn: React.FC<KendoColumnProps> = (props) => {
  const { title, ...restProps } = props;

  const intl = useIntl();
  const translate = (key: string) => intl.formatMessage({ id: key });

  return (
    <KendoColumnOrigin
      title={title ? translate(title) : undefined}
      headerCell={ColumnHeader}
      {...restProps}
    />
  );
};

// Need for rendering custom Column component inside Kendo Grid.
KendoColumn.displayName = KendoColumnOrigin.displayName;

const GridPresenter: React.FC<GridPresenterProps> = (props) => {
  const { data } = props;

  return (
    <AutoSizer>
      {({ width }) => (
        <KendoGlobalization>
          <KendoGrid
            style={{ width: `${width}px` }}
            data={data}
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

export default GridPresenter;
