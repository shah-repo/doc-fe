import useStyles from "./RelatedPart.styles";

import React from "react";

// import cx from "classnames";
import Text from "../../../../components/Text";

const RelatedPartsTableHeader: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  return (
    <div className={classes.tableHead} data-cy="relatedPartsTable">
      <div className={classes.tableCellOne}>
        <Text translation="relatedParts.grid.heading.docId"/>
      </div>
      <div className={classes.tableCellTwo}>
        <span className={classes.verticalDivider}>
          <Text translation="relatedParts.grid.heading.title"/>
        </span>
      </div>
      <div className={classes.tableCellThree}>
        <span className={classes.verticalDivider}>
          <Text translation="relatedParts.grid.heading.obsolete"/>
        </span>
      </div>
      <div className={classes.tableCellFour}></div>
    </div>
  );
};

export default RelatedPartsTableHeader;
