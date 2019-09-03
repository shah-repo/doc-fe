import React from "react";
import SvgIcon from '@material-ui/core/SvgIcon';
import styles from "./ChangeRequestList.styles";

const ChangeRequestList: React.FunctionComponent = () => {
  const classes = styles();

  return (
    <SvgIcon
      viewBox="0 0 16.457 16"
      classes={{
        root: classes.svgRoot,
      }}
    >
      <g transform="translate(-3.5 -1.5)">
        <path className={classes.border} d="M40,2V5h3" transform="translate(-27)" />
        <path className={classes.border} d="M16,7.149V5L13,2H4V17H16V13.5" />
        <path className={classes.pen} d="M38.5,31.75,37,32l.25-1.5,4.5-4.5L43,27.25Z" transform="translate(-23.75 -19)" />
      </g>
    </SvgIcon>
  );
}

export default ChangeRequestList;
