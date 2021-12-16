import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";

interface Props {
  data: string;
}

const Tooltip: React.FunctionComponent<Props> = ({
  data,
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
      title={<Typography>
        <div className={`${classes.tooltip}`}>
          {data?.replace(/,/g, ",\n")}
        </div>
      </Typography>}
      placement="left"
      arrow
    >
      <span>{data}</span>
    </StyledTooltip>
  );
};

export default Tooltip;
