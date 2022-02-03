import { Typography } from "@material-ui/core";
import React from "react";
import { StyleTooltip } from "../../../dashboard.new/line.items/common/StyleTooltip";
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
    <StyleTooltip
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
    </StyleTooltip>
  );
};

export default Tooltip;
