import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";

interface Props {
  data: string | number;
  customClass?: string;
  childrenElement?: any;
}

const Tooltip: React.FunctionComponent<Props> = ({
  data,
  customClass,
  childrenElement,
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
      enterDelay={1000}
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
    ><span>
        {!childrenElement && <span className={customClass}>{data}</span>}
        {childrenElement && childrenElement}
      </span>
    </StyledTooltip>
  );
};

export default Tooltip;
