import useStyles from './ApprovalRequestGrid.styles';

import React from 'react';
import Text from '../../components/Text';

const ApprovalRequestGridHeader: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <div className={classes.cellOne}>
        <Text translation="approvalRequest.grid.heading.item"/>
      </div>
      <div className={classes.cellOther}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.description.of.change"/>
        </span>
      </div>
      <div className={classes.cellOther}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.justification.of.change"/>
        </span>
      </div>
    </div>
  );
};

export default ApprovalRequestGridHeader;
