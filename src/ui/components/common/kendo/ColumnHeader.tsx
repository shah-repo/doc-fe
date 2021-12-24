import { makeStyles, Typography } from "@material-ui/core";
import {
  GridColumnMenuWrapper,
  GridHeaderCellProps,
} from "@progress/kendo-react-grid";
import React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";

interface Props {
  data: GridHeaderCellProps;
}

const HeaderTooltip: React.FunctionComponent<Props> = ({ data }) => {
  const styles = makeStyles(() => ({
    tooltip: {
      maxHeight: "100px",
      overflow: "auto",
      fontFamily: "Sora",
      fontSize: 12,
      whiteSpace: "pre-line",
    },
  }));
  const classes = styles();
  return (
    <>
      <StyledTooltip
        interactive={true}
        title={
          <Typography>
            <div className={`${classes.tooltip}`}>{data.title}</div>
          </Typography>
        }
        placement="top"
        arrow
      >
        <span className="k-link" onClick={data.onClick}>
          <span className="k-column-title">{data.title}</span>
          {data.children}
        </span>
      </StyledTooltip>
      <GridColumnMenuWrapper {...data.columnMenuWrapperProps} />
    </>
  );
};

export default HeaderTooltip;
