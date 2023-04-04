import React from "react";
import { useIntl } from "react-intl";
import {
  GridColumn as KendoColumnOrigin,
  GridColumnProps as KendoColumnProps,
} from "@progress/kendo-react-grid";
import ColumnHeader from "../../../../components/common/kendo/ColumnHeader";

const GridColumn: React.FC<KendoColumnProps> = (props) => {
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
GridColumn.displayName = KendoColumnOrigin.displayName;

export default GridColumn;
