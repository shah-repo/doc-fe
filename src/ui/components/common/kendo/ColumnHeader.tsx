import {
  GridColumnMenuWrapper,
  GridHeaderCellProps,
} from "@progress/kendo-react-grid";
import React from "react";
import Tooltip from "./Tooltip";

const HeaderTooltip: React.FunctionComponent<GridHeaderCellProps> = ({
  title,
  onClick,
  children,
  columnMenuWrapperProps,
}) => (
  <>
    {title && (
      <Tooltip
        placement="top"
        data={title}
        childrenElement={
          <span className="k-link" onClick={onClick}>
            <span className="k-column-title">{title.toUpperCase()}</span>
            {children}
          </span>
        }
      />
    )}

    {columnMenuWrapperProps.columnMenu && (
      <GridColumnMenuWrapper {...columnMenuWrapperProps} />
    )}
  </>
);

export default HeaderTooltip;
