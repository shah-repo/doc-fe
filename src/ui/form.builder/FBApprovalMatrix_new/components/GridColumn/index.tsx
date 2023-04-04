import React from "react";
import { useTranslate } from "../../../../../common/intl";
import {
  GridColumn as KendoColumnOrigin,
  GridColumnProps as KendoColumnProps,
} from "@progress/kendo-react-grid";
import ColumnHeader from "../../../../components/common/kendo/ColumnHeader";

const GridColumn: React.FC<KendoColumnProps> = (props) => {
  const { title, ...restProps } = props;

  const translate = useTranslate();

  return (
    <KendoColumnOrigin
      title={translate(title)}
      headerCell={ColumnHeader}
      {...restProps}
    />
  );
};

// Need for rendering custom Column component inside Kendo Grid.
GridColumn.displayName = KendoColumnOrigin.displayName;

export default GridColumn;
