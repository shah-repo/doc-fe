import { Typography } from "@material-ui/core";
import React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";
import { styles } from "./Tooltip.styles";

interface Props {
  data: string | number;
  customClass?: string;
  childrenElement?: JSX.Element;
  placement?: "bottom" | "left" | "right" | "top";
}

const Tooltip: React.FunctionComponent<Props> = ({
  data,
  customClass,
  childrenElement,
  placement = "left",
}) => {
  const classes = styles();
  return (
    <StyledTooltip
      interactive={true}
      enterDelay={1000}
      title={
        <Typography component={"p"} className={`${classes.tooltip}`}>
          {typeof data === "string" ? data?.replace(/,/g, ",\n") : data}
        </Typography>
      }
      placement={placement}
      arrow
    >
      <span>
        {!childrenElement && <span className={customClass}>{data}</span>}
        {childrenElement && childrenElement}
      </span>
    </StyledTooltip>
  );
};

export default Tooltip;
