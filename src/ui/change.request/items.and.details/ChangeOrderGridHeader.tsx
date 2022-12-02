import useStyles from "./ChangeOrderGrid.styles";

import React from "react";
import Text from "../../components/Text";

const ChangeOrderGridHeader: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <div className={classes.cellOne}>
        <Text translation="changeorder.grid.heading.item"/>
      </div>
      <div className={classes.cellTwo}>
        <span className={classes.verticalDivider}>
          <Text translation="changeorder.grid.heading.description.of.change"/>
        </span>
      </div>
      <div className={classes.cellThree}>
        <span className={classes.verticalDivider}>
          <Text translation="changeorder.grid.heading.justification.of.change"/>
        </span>
      </div>
    </div>
  );
};

export default ChangeOrderGridHeader;
