import useStyles from "./ChangeOrderGrid.styles";

import React from "react";
import Text from "../../components/Text";

import cx from "classnames";

const ChangeOrderGridHeader: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <div className={cx(classes.cellOne, classes.itemLeftPadding)}>
        <Text translation="form.builder.document"/>
      </div>
      <div className={classes.cellTwo}>
        <span className={classes.verticalDivider}>
          <Text translation="form.builder.description.of.change"/>
        </span>
      </div>
      <div className={classes.cellThree}>
        <span className={classes.verticalDivider}>
          <Text translation="form.builder.justification.of.change"/>
        </span>
      </div>
    </div>
  );
};

export default ChangeOrderGridHeader;
