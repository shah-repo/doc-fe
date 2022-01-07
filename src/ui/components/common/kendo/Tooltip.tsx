import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";

interface Props {
  data: string | number;
  customClass?: string;
}

const Tooltip: React.FunctionComponent<Props> = ({
  data,
  customClass,
}) => {
  const styles = makeStyles(() => ({
    tooltip: {
      maxHeight: "calc(100vh - 700px)",
      overflow: "auto",
      fontFamily: "Sora",
      fontSize: 12,
      whiteSpace: "pre-line",
    },
  }));
  const classes = styles();
  return (
    <StyledTooltip
      interactive={true}
      title={
        <Typography
          component={"p"}
          className={`${classes.tooltip}`}
        >
          {typeof data === "string" ? data?.replace(/,/g, ",\n") : data}
        </Typography>
      }
      placement="left"
      arrow
    >
      <span className={customClass}>{data}</span>
    </StyledTooltip>
  );
};

export default Tooltip;
