import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import Text from '../../components/Text';
import useStyles from './ApprovalRequestGrid.styles';

const ApprovalRequestGridHeader: React.FunctionComponent<{
  isLineItemPartCanBeSubstituted?: boolean}> = ({ isLineItemPartCanBeSubstituted }) => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      { isLineItemPartCanBeSubstituted && <div className={classes.cellautoUpdate}>
        <Tooltip title={translate('approvalRequest.grid.heading.autoUpdate.title')} placement="right"
          classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          arrow>
          <span><Text translation="approvalRequest.grid.heading.autoUpdate" /></span>
        </Tooltip>
      </div> }
      <div className={classes.cellOne}>
        <span className={cx(isLineItemPartCanBeSubstituted ? classes.verticalDivider : '')}>
          <Text translation="approvalRequest.grid.heading.item" />
        </span>
      </div>
      <div className={classes.cellRev}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.rev" />
        </span>
      </div>
      <div className={classes.cellOther}>
        <span className={classes.verticalDivider}>
          <Text translation="common.attachments" />
        </span>
      </div>
      <div className={classes.cellOther}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.description.of.change" />
        </span>
      </div>
      <div className={classes.cellOther}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.justification.of.change" />
        </span>
      </div>
      <div className={classes.cellWhereUsed}>
        <span className={classes.verticalDivider}>
          <Text translation="approvalRequest.grid.heading.where.used" />
        </span>
      </div>
    </div>
  );
};

export default ApprovalRequestGridHeader;
