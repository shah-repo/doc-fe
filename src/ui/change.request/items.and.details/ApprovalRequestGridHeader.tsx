import useStyles from './ApprovalRequestGrid.styles';

import React from 'react';
import Text from '../../components/Text';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';

const ApprovalRequestGridHeader: React.FunctionComponent<{
  lineItemPartCanSubstitute?: boolean}> = ({ lineItemPartCanSubstitute }) => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      { lineItemPartCanSubstitute && <div className={classes.cellautoUpdate}>
        <Tooltip title="Part revision will be auto updated in the parent BOM" placement="right"
          classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          arrow>
          <span><Text translation="approvalRequest.grid.heading.autoUpdate" /></span>
        </Tooltip>
      </div> }
      <div className={classes.cellOne}>
        <span className={cx(lineItemPartCanSubstitute ? classes.verticalDivider : '')}>
          <Text translation="approvalRequest.grid.heading.item" />
        </span>
      </div>
      <div className={cx(lineItemPartCanSubstitute ? classes.smallCellOther : classes.cellOther)}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.description.of.change" />
        </span>
      </div>
      <div className={cx(lineItemPartCanSubstitute ? classes.smallCellOther : classes.cellOther)}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.justification.of.change" />
        </span>
      </div>
    </div>
  );
};

export default ApprovalRequestGridHeader;
