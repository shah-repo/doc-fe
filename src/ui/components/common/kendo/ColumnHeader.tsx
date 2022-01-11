import {
  GridColumnMenuWrapper,
  GridHeaderCellProps,
} from "@progress/kendo-react-grid";
import React from "react";
import Tooltip from "./Tooltip";

interface Props {
  data: GridHeaderCellProps;
}

const HeaderTooltip: React.FunctionComponent<Props> = ({ data }) => (
  <>
    {data.title && (
      <Tooltip
        placement="top"
        data={data.title}
        childrenElement={
          <span className="k-link" onClick={data.onClick}>
            <span className="k-column-title">{data.title.toUpperCase()}</span>

            {data.children}
          </span>
        }
      />
    )}

    {data.columnMenuWrapperProps.columnMenu && (
      <GridColumnMenuWrapper {...data.columnMenuWrapperProps} />
    )}
  </>
);

export default HeaderTooltip;
